import { Common, Renderer } from "@freelensapp/extensions";
import { observer } from "mobx-react";
import React from "react";
import { Link } from "react-router-dom";
import { JobSet, jobSetStore } from "../k8s/jobset/jobset";

const {
  Component: { KubeObjectListLayout, KubeObjectAge, Tooltip, Badge },
  K8sApi: { namespacesApi },
  Navigation: { getDetailsUrl },
} = Renderer;

const {
  Util: { stopPropagation },
} = Common;

enum sortBy {
  name = "name",
  namespace = "namespace",
  status = "status",
  age = "age",
}

@observer
export class JobSetPage extends React.Component {
  render() {
    return (
      <KubeObjectListLayout
        tableId="jobsetTable"
        className="JobSets"
        store={jobSetStore}
        sortingCallbacks={{
          [sortBy.name]: (js: JobSet) => js.getName(),
          [sortBy.namespace]: (js: JobSet) => js.getNs(),
          [sortBy.status]: (js: JobSet) => js.status?.conditions?.find(c => c.status === "True")?.type ?? "Unknown",
          [sortBy.age]: (js: JobSet) => js.getCreationTimestamp(),
        }}
        searchFilters={[(js: JobSet) => js.getSearchFields()]}
        renderHeaderTitle="JobSets"
        renderTableHeader={[
          { title: "Name", className: "name", sortBy: sortBy.name },
          { title: "Namespace", className: "namespace", sortBy: sortBy.namespace },
          { title: "Status", className: "status", sortBy: sortBy.status },
          { title: "Age", className: "age", sortBy: sortBy.age },
        ]}
        renderTableContents={(js: JobSet) => {
          const id = js.getId();
          const conditions = js.status?.conditions ?? [];

          let statusText = "Unknown";
          const activeCondition = conditions.find(c => c.status === "True");

          if (activeCondition) {
            statusText = activeCondition.type;
          } else {
            const suspendedCondition = conditions.find(c => c.type === "Suspended");
            if (suspendedCondition?.status === "False") {
              statusText = "Resumed";
            } else if (conditions.length > 0) {
              statusText = conditions[0].type;
            }
          }

          return [
            <>
              <span id={`${id}-name`}>{js.getName()}</span>
              <Tooltip targetId={`${id}-name`}>{js.getName()}</Tooltip>
            </>,
            <>
              <span id={`${id}-namespace`}>
                <Link
                  key="link"
                  to={getDetailsUrl(namespacesApi.formatUrlForNotListing({ name: js.getNs() }))}
                  onClick={stopPropagation}
                >
                  {js.getNs()}
                </Link>
              </span>
              <Tooltip targetId={`${id}-namespace`}>{js.getNs()}</Tooltip>
            </>,
            <Badge label={statusText} disabled={statusText !== activeCondition?.type} />,
            <KubeObjectAge object={js} key="age" />,
          ];
        }}
      />
    );
  }
}
