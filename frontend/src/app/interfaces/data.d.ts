interface User {
  email: string;
  password: string;
  name: string;
  roles: Role[];
  relateCourses: Course[];
}

interface Role {
  name: string;
  description: string;
}

interface Course {
  faculty: string;
  department: string;
  subject: string;
  catalog: string;
  section: string;
  description: string;
  component: string;
  location: string;
  mode: string;
  _class: string;
  start_date: string;
  end_date: string;
  wait_tot: string;
  current_enrolment: string;
  cap_enrolment: string;
  full: string;
}
