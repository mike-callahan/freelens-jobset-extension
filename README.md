# @freelensapp/freelens-jobset-extension

# FreeLens JobSet Extension

A FreeLens extension that adds support for Kubernetes JobSets (https://jobset.sigs.k8s.io/docs/overview/).

## Features

- **JobSet Management**: Adds a dedicated menu entry for JobSets.
- **Detailed Views**: Click on any JobSet to see detailed information including:
  - Status (suspended/resumed etc.)
  - K8s Jobs that are children of the JobSet.
  - Pods that are children of the K8s JobSet/Jobs
  - Number of replicated Jobs

## Requirements

I have tested with FreeLens 1.5.3. I imagine it works on older versions fine though.

## Installation

### From Release

1. Download the latest `.tgz` file from the releases page
2. Open FreeLens
3. Navigate to Extensions (Cmd+Shift+E on macOS, Ctrl+Shift+E on Linux/Windows)
4. Click the browse and select install
5. Restart FreeLens

### From Source

```bash
# Clone the repository
git clone https://github.com/mike-callahan/freelens-jobset-extension.git
cd freelens-jobset-extension

# Install dependencies
pnpm install

# Build the extension
pnpm build

# Package the extension
npm pack

# Install the generated .tgz file in FreeLens

## License

Copyright (c) 2025 Freelens Authors, Mike Callahan.

[MIT License](https://opensource.org/licenses/MIT)
