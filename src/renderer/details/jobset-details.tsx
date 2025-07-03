import { Renderer } from "@freelensapp/extensions";
import React, { useEffect, useState } from "react";
import { JobSet } from "../k8s/jobset/jobset";


const {
  Component: { DrawerItem, Badge, KubeObjectMeta, PodDetailsList },
  Navigation: { getDetailsUrl, navigate },
  K8sApi: { apiManager, podsApi, jobApi },
} = Renderer;

// Get the built-in podStore dynamically

const podStore = apiManager.getStore(podsApi);
const jobStore = apiManager.getStore(jobApi);

export function JobSetDetails({
  object: jobSet,
}: Renderer.Component.KubeObjectDetailsProps<JobSet>): React.ReactElement | null {
  const [relatedJobs, setRelatedJobs] = useState<Renderer.K8sApi.KubeObject[]>([]);

useEffect(() => {
  if (!jobSet?.getName()) return;

  if (!jobStore) {
    console.error("jobStore is not available from apiManager.");
    return;
  }

  const loadJobs = async () => {
    try {
      await jobStore.loadAll();
      const jobs = jobStore.items.filter(
        (job) =>
          job.metadata?.labels?.["jobset.sigs.k8s.io/jobset-name"] === jobSet.getName()
      );
      setRelatedJobs(jobs);
    } catch (err) {
      console.error("Failed to load jobs:", err);
    }
  };

  loadJobs();
}, [jobSet, jobStore]);

  useEffect(() => {
    if (relatedJobs.length === 0) return;

    podStore?.loadAll?.().catch((err) => {
      console.error("Failed to load pods:", err);
    });
  }, [relatedJobs]);

  if (!jobSet) return null;

  const pods = podStore?.items?.filter((pod) =>
    relatedJobs.some((job) => pod.metadata?.ownerReferences?.some(ref => ref.name === job.getName()))
  ) ?? [];

  return (
    <>
      <div className="JobSetDetails">
        <KubeObjectMeta object={jobSet} />

        <DrawerItem name="Replicated Jobs">
          {(jobSet.spec.replicatedJobs ?? []).length || 0}
        </DrawerItem>

        <DrawerItem name="Conditions" labelsOnly>
          {(jobSet.status?.conditions ?? []).map((cond, i) => (
            <Badge key={i} label={cond.type} disabled={cond.status !== "True"} />
          ))}
        </DrawerItem>

        <DrawerItem name="Jobs in this JobSet">
          {relatedJobs.length > 0 ? (
            relatedJobs.map((job) => (
              <div key={job.getId()}>
                <span
                  role="button"
                  style={{ cursor: "pointer", color: "#40a9ff", textDecoration: "underline" }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(getDetailsUrl(job.selfLink));
                  }}
                >
                  {job.getName()}
                </span>
              </div>
            ))
          ) : (
            "None found"
          )}
        </DrawerItem>
      </div>

      {pods.length > 0 && (
        <div className="PodDetailsListSection">
            <PodDetailsList pods={pods} owner={jobSet}/>
        </div>
      )}
    </>
  );
}
