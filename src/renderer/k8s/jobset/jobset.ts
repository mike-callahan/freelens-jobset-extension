import { Renderer } from "@freelensapp/extensions";

type KubeObjectMetadata = Renderer.K8sApi.KubeObjectMetadata;
const KubeObject = Renderer.K8sApi.KubeObject;
const KubeObjectStore = Renderer.K8sApi.KubeObjectStore;

export interface JobSetSpec {
  replicatedJobs: any[]; // You can refine this later
}

export interface JobSetStatus {
  conditions?: any[];
}

export class JobSet extends KubeObject<KubeObjectMetadata, JobSetStatus, JobSetSpec> {
  static readonly kind = "JobSet";
  static readonly namespaced = true;
  static readonly apiBase = "/apis/jobset.x-k8s.io/v1alpha2/jobsets";
}

export class JobSetApi extends Renderer.K8sApi.KubeApi<JobSet> {}
export const jobSetApi = new JobSetApi({ objectConstructor: JobSet });

export class JobSetStore extends KubeObjectStore<JobSet> {
  api = jobSetApi;
}

export const jobSetStore = new JobSetStore();
Renderer.K8sApi.apiManager.registerStore(jobSetStore);

export const jobSetObject = {
  kind: "JobSet",
  apiVersions: ["jobset.x-k8s.io/v1alpha2"],
  api: jobSetApi,
};
