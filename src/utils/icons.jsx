import { lazy } from "react";

const lazyIcon = (importFunction) => {
  const IconComponent = lazy(importFunction);
  return (props) => <IconComponent {...props} />;
};

const iconComponents = {
  add: lazyIcon(() => import("@ant-design/icons/PlusOutlined")),
  back: lazyIcon(() => import("@ant-design/icons/LeftOutlined")),
  calendar: lazyIcon(() => import("@ant-design/icons/CalendarOutlined")),
  check: lazyIcon(() => import("@ant-design/icons/CheckOutlined")),
  close: lazyIcon(() => import("@ant-design/icons/CloseOutlined")),
  comment: lazyIcon(() => import("@ant-design/icons/CommentOutlined")),
  contact: lazyIcon(() => import("@ant-design/icons/ContactsOutlined")), //witnesses
  copyright: lazyIcon(() => import("@ant-design/icons/CopyrightOutlined")),
  crown: lazyIcon(() => import("@ant-design/icons/CrownOutlined")),
  dashboard: lazyIcon(() => import("@ant-design/icons/DashboardOutlined")),
  delete: lazyIcon(() => import("@ant-design/icons/DeleteOutlined")),
  edit: lazyIcon(() => import("@ant-design/icons/EditOutlined")),
  filter: lazyIcon(() => import("@ant-design/icons/FilterOutlined")),
  flag: lazyIcon(() => import("@ant-design/icons/FlagOutlined")),
  forward: lazyIcon(() => import("@ant-design/icons/RightOutlined")),
  history: lazyIcon(() => import("@ant-design/icons/HistoryOutlined")),
  home: lazyIcon(() => import("@ant-design/icons/HomeOutlined")),
  idcard: lazyIcon(() => import("@ant-design/icons/IdcardOutlined")), //students
  info: lazyIcon(() => import("@ant-design/icons/InfoCircleOutlined")),
  invisible: lazyIcon(() => import("@ant-design/icons/EyeInvisibleOutlined")),
  link: lazyIcon(() => import("@ant-design/icons/LinkOutlined")),
  loading: lazyIcon(() => import("@ant-design/icons/LoadingOutlined")),
  lock: lazyIcon(() => import("@ant-design/icons/LockOutlined")),
  login: lazyIcon(() => import("@ant-design/icons/LoginOutlined")),
  logout: lazyIcon(() => import("@ant-design/icons/LogoutOutlined")),
  menu: lazyIcon(() => import("@ant-design/icons/MenuOutlined")),
  moon: lazyIcon(() => import("@ant-design/icons/MoonOutlined")),
  more: lazyIcon(() => import("@ant-design/icons/MoreOutlined")),
  number: lazyIcon(() => import("@ant-design/icons/NumberOutlined")),
  open: lazyIcon(() => import("@ant-design/icons/ExportOutlined")),
  openbook: lazyIcon(() => import("@ant-design/icons/ReadOutlined")), //cases
  paperclip: lazyIcon(() => import("@ant-design/icons/PaperClipOutlined")),
  question: lazyIcon(() => import("@ant-design/icons/QuestionOutlined")),
  refresh: lazyIcon(() => import("@ant-design/icons/ReloadOutlined")),
  save: lazyIcon(() => import("@ant-design/icons/SaveOutlined")),
  school: lazyIcon(() => import("@ant-design/icons/BankOutlined")), //schools
  search: lazyIcon(() => import("@ant-design/icons/SearchOutlined")),
  settings: lazyIcon(() => import("@ant-design/icons/SettingOutlined")),
  sun: lazyIcon(() => import("@ant-design/icons/SunOutlined")),
  team: lazyIcon(() => import("@ant-design/icons/TeamOutlined")), //teams
  trophy: lazyIcon(() => import("@ant-design/icons/TrophyOutlined")), //tournaments
  unlock: lazyIcon(() => import("@ant-design/icons/UnlockOutlined")),
  user: lazyIcon(() => import("@ant-design/icons/UserOutlined")),
  userAdd: lazyIcon(() => import("@ant-design/icons/UserAddOutlined")),
  userDelete: lazyIcon(() => import("@ant-design/icons/UserDeleteOutlined")),
  usergroupAdd: lazyIcon(() =>
    import("@ant-design/icons/UsergroupAddOutlined")
  ),
  usergroupDelete: lazyIcon(() =>
    import("@ant-design/icons/UsergroupDeleteOutlined")
  ),
  visible: lazyIcon(() => import("@ant-design/icons/EyeOutlined")),
  warning: lazyIcon(() => import("@ant-design/icons/WarningOutlined")),
};

export default iconComponents;
