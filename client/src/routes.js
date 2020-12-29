//appConfig
import appConfig from "./views/app-config";
import Settings from "./components/app-config/Settings";
import Search from "./components/app-config/Search";
import TableBuilder from "./components/app-config/TableBuilder";
import Statistics from "./components/app-config/Statistics";
import BranchDiffs from "./components/app-config/BranchDiffs";

//externalConfig
import externalConfigurations from "./views/external-configurations";
import Configure from "./components/external-config/Configure";
import ecSettings from "./components/external-config/Settings";

//profileView
import profileView from "./views/profile-view";
import profileViewSelect from "./components/profile-view/Select";
import profileViewView from "./components/profile-view/View";

//home
import home from "./views/home";
import homeHowTo from "./components/home/HowTo";
import ReadMe from "./components/home/ReadMe";

export default [
   {
      path: "/",
      redirect: "/home",
   },
   {
      name: "home",
      path: "/home",
      component: home,
      children: [
         {
            name: "how-to",
            path: "how-to",
            component: homeHowTo,
         },
         {
            name: "settings",
            path: "settings",
            component: Settings,
         },
         {
            name: "readme",
            path: "read-me",
            component: ReadMe,
         },
      ],
   },
   {
      // app-config routes
      path: "/app-config-xml",
      name: "app-config-xml",
      component: appConfig,
      children: [
         {
            name: "search",
            path: "search",
            component: Search,
         },
         {
            name: "branch-diffs",
            path: "branch-diffs",
            component: BranchDiffs,
         },
         {
            name: "table-builder",
            path: "table-builder",
            component: TableBuilder,
         },
         {
            name: "statistics",
            path: "statistics",
            component: Statistics,
         },
      ],
   },
   {
      // external-configuration routes
      path: "/external-configurations",
      name: "external-configuration",
      component: externalConfigurations,
      children: [
         {
            name: "configure",
            path: "configure",
            component: Configure,
         },
         {
            name: "ecsettings",
            path: "settings",
            component: ecSettings,
         },
      ],
   },
   {
      //profileview routes
      path: "/profile-view",
      name: "profile-view",
      component: profileView,
      children: [
         {
            name: "select",
            path: "select",
            component: profileViewSelect,
         },
         {
            name: "view",
            path: "view/:id",
            component: profileViewView,
         },
      ],
   },
];
