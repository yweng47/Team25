const host = 'http://localhost:3000';

const apiUrl = {
  login: `${host}/login`,
  user: `${host}/admin/user`,
  inviteRegister: `${host}/admin/inviteRegister`,
  checkToken: `${host}/checkToken`,
  getCourseByCode: `${host}/getCourseByCode`,
  course: `${host}/instructor/course`,
  notice: `${host}/admin/notice`,
  question: `${host}/instructor/question`,
  importApplications: `${host}/import/application`,
  applications: `${host}/instructor/application`,
  importEnrollmentHours: `${host}/import/enrollmentHour`,
  enrollmentHours: `${host}/instructor/enrollmentHour`,
  courseTA: `${host}/instructor/courseTA`,
  taHour: `${host}/instructor/taHour`,
  importPreferences: `${host}/import/preference`,
  preference: `${host}/instructor/preference`,
  autoTAHours: `${host}/instructor/autoTAHours`,
  changeUserChair: `${host}/admin/changeUserChair`,
  taCourse: `${host}/admin/taCourse`
};

export default apiUrl;
