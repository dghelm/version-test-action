const core = require("@actions/core");
const github = require("@actions/github");

const VERSION_RELEASE = "1.0.0-beta"

(async () => {
  try {
    const inputExample = core.getInput("input-example")
    core.setOutput("version", VERSION_RELEASE);
    console.log(`Input: ${inputExample}`);
    console.log(`Version: ${VERSION_RELEASE}`);

    // put a skylink in a pull request comment if available
    if (github.context.issue.number) {
      const gitHubToken = core.getInput("github-token");
      const octokit = github.getOctokit(gitHubToken);

      try {
        await octokit.issues.createComment({
          ...github.context.repo,
          issue_number: github.context.issue.number,
          body: `Version number ${VERSION_RELEASE}<br>Input: \`${inputExample}\``,
        });
      } catch (error) {
        console.log(`Failed to create comment: ${error.message}`);
      }
    }
  } catch (error) {

    core.setFailed(`Failed to deploy: ${error.message}`);
  }
})();
