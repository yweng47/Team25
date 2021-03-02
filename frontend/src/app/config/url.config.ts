const host = 'http://localhost:3000';

const apiUrl = {
  login: `${host}/login`,
  user: `${host}/admin/user`,
  inviteRegister: `${host}/admin/inviteRegister`,
  checkToken: `${host}/checkToken`,
  getCourseByCode: `${host}/getCourseByCode`,
  notice: `${host}/admin/notice`
};

export default apiUrl;