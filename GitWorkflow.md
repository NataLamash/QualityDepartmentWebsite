# Git Workflow Guidelines

This document describes the branching strategy, commit rules, and Pull Request (PR) process for the Quality Department project. Following these rules ensures code stability and effective collaboration.

## Branching Strategy

We use three types of branches to manage our code:

* **main**: The stable branch. It must always be in a working state. We merge into main only when a stable milestone is reached. Direct pushes to main are strictly prohibited.
* **dev**: The integration branch. All completed features are merged into dev. This branch should always build and run successfully. Direct pushes to dev are not allowed.
* **feature/* **: Isolated branches for specific tasks. One task equals one branch and one PR.
    * **Naming convention**: `feature/QUAL-XX-short-description`.
    * **Example**: `feature/QUAL-1-initial-setup`.

## How to Work on a Task

1.  **Prepare your local environment**:
    Ensure your local dev branch is up to date:
    ```bash
    git checkout dev
    git pull
    ```

2.  **Create a feature branch**:
    Create a new branch from dev:
    ```bash
    git checkout -b feature/QUAL-XX-short-description
    ```

3.  **Development and Commits**:
    Work on your task and commit your changes locally. Ensure your commits follow the rules mentioned below.

4.  **Push your branch**:
    Upload your feature branch to the remote repository:
    ```bash
    git push -u origin feature/QUAL-XX-short-description
    ```

5.  **Open a Pull Request**:
    Once the task is complete, create a PR on GitHub.
    * **Source**: `feature/QUAL-XX-short-description`.
    * **Target**: `dev`.

## Commit Guidelines

* **Meaningful Messages**: Commits should be small and describe specific changes.
* **Format**: Every commit message must start with the task key.
    * **Format**: `QUAL-XX: <short description>`.
    * **Example**: `QUAL-1: add solution structure`.
* **Location**: Commit only to your specific feature branch. Never commit directly to dev or main.

## Pull Request Rules

* **No Direct Pushes**: Every change must go through a Pull Request to dev or main.
* **Review Process**: At least one approval from a team member is required before merging a PR.
* **Resolution**: If there are review comments, they must be resolved before the merge.
* **Cleanup**: Delete the feature branch locally and on GitHub after the PR is successfully merged.

## Coding Standards

* All code must follow C# formatting conventions.
* The project should be buildable without errors before a PR is opened.