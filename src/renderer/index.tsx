import { Renderer } from "@freelensapp/extensions";

import { JobSetPage } from "./pages/jobset-page";
import { JobSetDetails } from "./details/jobset-details";
import { jobSetObject } from "./k8s/jobset/jobset";

function JobSetIcon(props: Renderer.Component.IconProps) {
  return <Renderer.Component.Icon {...props} material="dns" />;
}

export default class JobSetRenderer extends Renderer.LensExtension {
  kubeObjectDetailItems = [
    {
      kind: jobSetObject.kind,
      apiVersions: jobSetObject.apiVersions,
      priority: 10,
      components: {
        Details: (props) => <JobSetDetails {...props} />,
      },
    },
  ];

  clusterPages = [
    {
      id: "jobsets-page",
      components: {
        Page: () => <JobSetPage />,
      },
    },
  ];

  clusterPageMenus = [
    {
      id: "jobsets",
      title: "JobSets",
      target: { pageId: "jobsets-page" },
      components: {
        Icon: JobSetIcon,
      },
    },
  ];
}
