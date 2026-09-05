"""Build a Kaggle-compatible resume notebook from the Colab translation notebook."""

from __future__ import annotations

import json
from pathlib import Path


SOURCE = Path(r"H:\My Drive\1ab. Publication\2026. 7b. Apoteq Pepo Website\notebooks8\03_translate_dailymed_medlineplus.ipynb")
TARGET = Path(r"H:\My Drive\1ab. Publication\2026. 7b. Apoteq Pepo Website\notebooks8\03_translate_dailymed_medlineplus_kaggle.ipynb")


def code_cell(source: str) -> dict:
    return {"cell_type": "code", "execution_count": None, "metadata": {}, "outputs": [], "source": source.splitlines(keepends=True)}


notebook = json.loads(SOURCE.read_text(encoding="utf-8"))
cells = notebook["cells"]

for cell in cells:
    source = "".join(cell.get("source", []))
    if "from google.colab import drive" in source:
        cell["source"] = [
            "%pip -q install \"transformers>=4.45,<5\" sentencepiece accelerate \"pyarrow>=17\" \"pandas>=2.2,<2.3\" duckdb boto3 tqdm\n",
            "\n",
            "# Kaggle: dataset input bersifat read-only; salinan kerja dibuat di /kaggle/working.\n",
        ]
    if 'NOTEBOOK_DIR = Path("/content/drive/MyDrive/notebooks8")' in source:
        replacement = '''KAGGLE_DATASET_SLUG = "pustakaobat-translation-resume-v1"
KAGGLE_INPUT_DIR = Path("/kaggle/input") / KAGGLE_DATASET_SLUG
KAGGLE_WORK_DIR = Path("/kaggle/working/pustakaobat_translation_resume")
KAGGLE_BUNDLE_DIR = KAGGLE_WORK_DIR / "kaggle_translation_resume_v1"

if not KAGGLE_INPUT_DIR.exists():
    raise FileNotFoundError(
        "Dataset Kaggle belum dipasang. Klik Add Input lalu pilih " + KAGGLE_DATASET_SLUG
    )

if not (KAGGLE_BUNDLE_DIR / "data_indonesian_dailymed_medlineplus_v1" / "checkpoint.json").exists():
    archives = sorted(KAGGLE_INPUT_DIR.glob("*.zip"))
    if len(archives) != 1:
        raise RuntimeError("Dataset harus berisi tepat satu ZIP paket resume.")
    print("Mengekstrak paket resume Kaggle (hanya sekali per sesi)...")
    shutil.unpack_archive(archives[0], KAGGLE_WORK_DIR)

NOTEBOOK_DIR = KAGGLE_BUNDLE_DIR
DATA_ROOT = NOTEBOOK_DIR / "data_integrated_v1"
OUTPUT_ROOT = NOTEBOOK_DIR / "data_indonesian_dailymed_medlineplus_v1"

# Pilihan: "benchmark", "full", atau "publish".
RUN_MODE = "full"
'''
        start = source.index('NOTEBOOK_DIR = Path("/content/drive/MyDrive/notebooks8")')
        end = source.index('BENCHMARK_MINUTES = 20')
        source = source[:start] + replacement + "\n" + source[end:]
        cell["source"] = source.splitlines(keepends=True)
    if "required = [\n    SOURCE_MANIFEST_PATH" in source:
        old = '''required = [
    SOURCE_MANIFEST_PATH, DAILYMED_DOCUMENTS_PATH, MEDLINEPLUS_TOPICS_PATH,
    MEDLINEPLUS_SITES_PATH,
]
missing = [str(path) for path in required if not path.exists()]
if missing:
    raise FileNotFoundError("Input belum lengkap:\\n" + "\\n".join(missing))

source_manifest = read_json(SOURCE_MANIFEST_PATH, {})
'''
        new = '''if not SOURCE_MANIFEST_PATH.exists():
    raise FileNotFoundError(f"Manifest sumber tidak ada: {SOURCE_MANIFEST_PATH}")

source_manifest = read_json(SOURCE_MANIFEST_PATH, {})
'''
        if old not in source:
            raise RuntimeError("Pola validasi sumber tidak ditemukan.")
        cell["source"] = source.replace(old, new).splitlines(keepends=True)

insert_at = next(i for i, cell in enumerate(cells) if "## 4. Bangun inventaris teks unik" in "".join(cell.get("source", [])))
cells.insert(insert_at, code_cell('''# Kaggle checkpoint sync (opsional tetapi dianjurkan untuk sesi berikutnya)
# Tambahkan empat secret Kaggle berikut agar checkpoint tiap 10 menit tersimpan privat di R2:
# R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
KAGGLE_R2_CHECKPOINT_SYNC = True
R2_CHECKPOINT_PREFIX = "pustakaobat/integrated/v1/translation-checkpoints/dailymed-medlineplus-id-v1"
r2_checkpoint_client = None

def kaggle_secret(name: str) -> str:
    try:
        from kaggle_secrets import UserSecretsClient
        return str(UserSecretsClient().get_secret(name) or "").strip()
    except Exception:
        return str(os.environ.get(name, "")).strip()

if KAGGLE_R2_CHECKPOINT_SYNC:
    r2_values = {name: kaggle_secret(name) for name in [
        "R2_ENDPOINT", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET"
    ]}
    missing_r2 = [name for name, value in r2_values.items() if not value]
    if missing_r2:
        print("R2 checkpoint sync belum aktif; secret Kaggle belum ada:", ", ".join(missing_r2))
    else:
        r2_checkpoint_client = boto3.client(
            "s3", endpoint_url=r2_values["R2_ENDPOINT"].rstrip("/"),
            aws_access_key_id=r2_values["R2_ACCESS_KEY_ID"],
            aws_secret_access_key=r2_values["R2_SECRET_ACCESS_KEY"],
            region_name="auto", config=Config(signature_version="s3v4", retries={"max_attempts": 8, "mode": "adaptive"}),
        )
        print("R2 checkpoint sync aktif.")

def restore_kaggle_checkpoint_from_r2() -> None:
    if r2_checkpoint_client is None:
        return
    bucket = kaggle_secret("R2_BUCKET")
    paginator = r2_checkpoint_client.get_paginator("list_objects_v2")
    restored = 0
    for page in paginator.paginate(Bucket=bucket, Prefix=R2_CHECKPOINT_PREFIX + "/"):
        for item in page.get("Contents", []):
            key = item["Key"]
            relative = key.removeprefix(R2_CHECKPOINT_PREFIX + "/")
            if relative == "checkpoint.json":
                target = OUTPUT_ROOT / "checkpoint.json"
            elif relative.startswith("translation_parts/"):
                target = OUTPUT_ROOT / relative
            else:
                continue
            if target.exists() and target.stat().st_size == int(item["Size"]):
                continue
            target.parent.mkdir(parents=True, exist_ok=True)
            r2_checkpoint_client.download_file(bucket, key, str(target))
            restored += 1
    if restored:
        print(f"Checkpoint R2 dipulihkan: {restored} berkas.")

def sync_kaggle_checkpoint_to_r2(part_path: Path | None = None) -> None:
    if r2_checkpoint_client is None:
        return
    bucket = kaggle_secret("R2_BUCKET")
    if part_path is not None:
        key = R2_CHECKPOINT_PREFIX + "/translation_parts/" + part_path.name
        r2_checkpoint_client.upload_file(str(part_path), bucket, key)
    for path in [CHECKPOINT_PATH, PROGRESS_PATH, PROGRESS_HISTORY_PATH]:
        if path.exists():
            key = R2_CHECKPOINT_PREFIX + "/" + path.name
            r2_checkpoint_client.upload_file(str(path), bucket, key)

restore_kaggle_checkpoint_from_r2()
'''))

for cell in cells:
    source = "".join(cell.get("source", []))
    marker = '        write_json_atomic(CHECKPOINT_PATH, checkpoint)\n\n        rate = checkpoint["source_characters_completed"]'
    if marker in source:
        source = source.replace(
            marker,
            '        write_json_atomic(CHECKPOINT_PATH, checkpoint)\n        sync_kaggle_checkpoint_to_r2(final_path)\n\n        rate = checkpoint["source_characters_completed"]',
        )
        cell["source"] = source.splitlines(keepends=True)
    if 'raise RuntimeError("GPU tidak tersedia. Pilih Runtime → Change runtime type → GPU.")' in source:
        source = source.replace(
            'raise RuntimeError("GPU tidak tersedia. Pilih Runtime → Change runtime type → GPU.")',
            'raise RuntimeError("GPU Kaggle tidak tersedia. Buka Settings → Accelerator → GPU, lalu jalankan ulang.")',
        )
        cell["source"] = source.splitlines(keepends=True)

notebook.setdefault("metadata", {}).setdefault("kaggle", {})["accelerator"] = "gpu"
notebook["metadata"]["kaggle"]["dataSources"] = [{"datasetId": 0, "databundleVersionId": 0, "reference": "zakiulfahmi/pustakaobat-translation-resume-v1"}]
TARGET.write_text(json.dumps(notebook, ensure_ascii=False, indent=1), encoding="utf-8")
print(TARGET)
