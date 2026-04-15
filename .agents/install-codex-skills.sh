#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
SOURCE_ROOT="${REPO_ROOT}/.agents/skills"
CODEX_ROOT="${CODEX_HOME:-${HOME}/.codex}"
DEST_ROOT="${CODEX_ROOT}/skills"

mkdir -p "${DEST_ROOT}"

installed=0

for skill_dir in "${SOURCE_ROOT}"/*; do
  [ -d "${skill_dir}" ] || continue

  skill_name="$(basename "${skill_dir}")"
  target="${DEST_ROOT}/${skill_name}"

  if [ -e "${target}" ] && [ ! -L "${target}" ]; then
    echo "skip ${skill_name}: ${target} exists and is not a symlink" >&2
    continue
  fi

  ln -sfn "${skill_dir}" "${target}"
  echo "linked ${skill_name} -> ${target}"
  installed=$((installed + 1))
done

echo "installed ${installed} skill(s) into ${DEST_ROOT}"
