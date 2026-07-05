import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Home from '../pages/Home'
import ClusterArchitecturePage from '../pages/ClusterArchitecture'
import CreatingPodsPage from '../pages/CreatingPods'
import CronJobPage from '../pages/CronJob'
import DaemonSetPage from '../pages/DaemonSet'
import DeploymentPage from '../pages/Deployment'
import DockerPage from '../pages/Docker'
import JobPage from '../pages/Job'
import LabelsSelectorsPage from '../pages/LabelsSelectors'
import PodsPage from '../pages/Pods'
import ProbesPage from '../pages/Probes'
import ReplicaSetPage from '../pages/ReplicaSet'
import ReplicationControllerPage from '../pages/ReplicationController'
import ServicePage from '../pages/Service'
import VolumesPage from '../pages/Volumes'

function TopicRouter() {
  const { slug } = useParams()

  const page = useMemo(() => {
    switch (slug) {
      case 'docker':
        return <DockerPage />
      case 'cluster-architecture':
        return <ClusterArchitecturePage />
      case 'pods':
        return <PodsPage />
      case 'creating-pods':
        return <CreatingPodsPage />
      case 'replication-controller':
        return <ReplicationControllerPage />
      case 'replicaset':
        return <ReplicaSetPage />
      case 'daemonset':
        return <DaemonSetPage />
      case 'deployment':
        return <DeploymentPage />
      case 'job':
        return <JobPage />
      case 'cronjob':
        return <CronJobPage />
      case 'labels-selectors':
        return <LabelsSelectorsPage />
      case 'service':
        return <ServicePage />
      case 'probes':
        return <ProbesPage />
      case 'volumes':
        return <VolumesPage />
      default:
        return <Home />
    }
  }, [slug])

  return page
}

export default TopicRouter
