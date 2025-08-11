/**
 * Extracts the numeric job ID from a GitHub Actions workflow run using Octokit
 * @param octokit - The Octokit instance
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param runId - Workflow run ID
 * @param jobName - Name of the job to find
 * @returns The numeric job ID if found, undefined otherwise
 */
export async function extractJobId(
  octokit: ReturnType<typeof import("@actions/github").getOctokit>,
  owner: string,
  repo: string,
  runId: string,
  jobName: string,
): Promise<number | undefined> {
  try {
    console.log(">>> Extracting job ID for:", { owner, repo, runId, jobName });

    const response = await octokit.rest.actions.listJobsForWorkflowRun({
      owner,
      repo,
      run_id: parseInt(runId, 10),
    });

    console.log(
      ">>> Found jobs:",
      response.data.jobs.map((job) => ({ id: job.id, name: job.name })),
    );

    const job = response.data.jobs.find((j) => j.name === jobName);

    if (job) {
      console.log(">>> Found job ID:", job.id);
      return job.id;
    } else {
      console.log(">>> Job not found with name:", jobName);
      return undefined;
    }
  } catch (error) {
    console.error(">>> Failed to extract job ID:", error);
    return undefined;
  }
}

/**
 * Gets all jobs for a workflow run with their IDs and names
 * @param octokit - The Octokit instance
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param runId - Workflow run ID
 * @returns Array of jobs with their IDs and names
 */
export async function getWorkflowRunJobs(
  octokit: ReturnType<typeof import("@actions/github").getOctokit>,
  owner: string,
  repo: string,
  runId: string,
): Promise<
  Array<{ id: number; name: string; status: string; conclusion?: string }>
> {
  try {
    console.log(">>> Getting jobs for workflow run:", { owner, repo, runId });

    const response = await octokit.rest.actions.listJobsForWorkflowRun({
      owner,
      repo,
      run_id: parseInt(runId, 10),
    });

    const jobs = response.data.jobs.map((job) => ({
      id: job.id,
      name: job.name,
      status: job.status,
      conclusion: job.conclusion ?? undefined,
    }));

    console.log(">>> Found jobs:", jobs);
    return jobs;
  } catch (error) {
    console.error(">>> Failed to get workflow run jobs:", error);
    return [];
  }
}

/**
 * Finds a job by name and returns its full details
 * @param octokit - The Octokit instance
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param runId - Workflow run ID
 * @param jobName - Name of the job to find
 * @returns The job details if found, undefined otherwise
 */
export async function findJobByName(
  octokit: ReturnType<typeof import("@actions/github").getOctokit>,
  owner: string,
  repo: string,
  runId: string,
  jobName: string,
): Promise<
  | {
      id: number;
      name: string;
      status: string;
      conclusion?: string;
      started_at?: string;
      completed_at?: string;
    }
  | undefined
> {
  try {
    console.log(">>> Finding job by name:", { owner, repo, runId, jobName });

    const response = await octokit.rest.actions.listJobsForWorkflowRun({
      owner,
      repo,
      run_id: parseInt(runId, 10),
    });

    const job = response.data.jobs.find((j) => j.name === jobName);

    if (job) {
      const jobDetails = {
        id: job.id,
        name: job.name,
        status: job.status,
        conclusion: job.conclusion ?? undefined,
        started_at: job.started_at,
        completed_at: job.completed_at ?? undefined,
      };

      console.log(">>> Found job details:", jobDetails);
      return jobDetails;
    } else {
      console.log(">>> Job not found with name:", jobName);
      return undefined;
    }
  } catch (error) {
    console.error(">>> Failed to find job by name:", error);
    return undefined;
  }
}
