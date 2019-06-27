-- Data Analysis
-- #1 List the following details of each employee: 
-- employee number, last name, first name, gender, and salary

select employees.emp_no, employees.first_name, employees.last_name,employees.gender, salaries.salary
from employees inner join salaries on employees.emp_no = salaries.emp_no

--#2 List employees who were hired in 1986
select employees.emp_no, employees.first_name, employees.last_name, employees.hire_date
from employees where employees.hire_date between '1986-01-01' and '1986-12-31'
order by employees.hire_date

--#3List the manager of each department with the following information: 
--department number, department name, the manager's employee number, 
--last name, first name, and start and end employment dates.
select dept_manager.dept_no, departments.dept_name, dept_manager.emp_no,employees.first_name,
employees.last_name,dept_manager.from_date, dept_manager.to_date
from dept_manager 
inner join departments on departments.dept_no = dept_manager.dept_no
inner join employees on employees.emp_no = dept_manager.emp_no

--#4 List the department of each employee with the following information: 
--employee number, last name, first name, and department name.
select employees.emp_no, employees.last_name, employees.first_name, departments.dept_name
from employees 
inner join dept_emp on employees.emp_no = dept_emp.emp_no
inner join departments on departments.dept_no = dept_emp.dept_no

--#5List all employees whose first name is "Hercules",
--and last names begin with "B"
select employees.emp_no, employees.first_name, employees.last_name, 
employees.gender from employees 
where first_name = 'Hercules' and last_name like 'B%'

--#6List all employees in the Sales department, 
--including their employee number, last name, first name, and department name.
select employees.emp_no, employees.last_name, employees.first_name, departments.dept_name
from employees 
inner join dept_emp on employees.emp_no = dept_emp.emp_no
inner join departments on departments.dept_no = dept_emp.dept_no
where departments.dept_name = 'Sales'

--7#List all employees in the Sales and Development departments, including their 
--employee number, last name, first name, and department name.
select employees.emp_no, employees.last_name, employees.first_name, departments.dept_name
from employees 
inner join dept_emp on employees.emp_no = dept_emp.emp_no
inner join departments on departments.dept_no = dept_emp.dept_no
where departments.dept_name = 'Sales' or departments.dept_name = 'Development'

--8# In descending order, list the frequency count of employee last names, 
--i.e., how many employees share each last name.
select last_name, count(last_name) as "Total_Emp_Count"
from employees
group by last_name
order by "Total_Emp_Count" desc