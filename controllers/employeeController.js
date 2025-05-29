import Employee from '../models/Employee.js';

// Add a new employee
export const addEmployee = async (req, res) => {
  const { firstName, lastName, middleName, dob, department, salary, permanentAddress, currentAddress } = req.body;

  try {
    // Generate Employee ID (XXXXX1 format)
    const employeeCount = await Employee.countDocuments();
    const employeeId = `EMP${String(employeeCount + 1).padStart(4, '0')}`;

    // Generate Login ID
    let loginId = firstName.charAt(0).toLowerCase() + lastName.toLowerCase();
    let existingEmployee = await Employee.findOne({ loginId });
    
    // If Login ID already exists, append random 3 digits
    while (existingEmployee) {
      loginId = loginId + Math.floor(Math.random() * 1000);
      existingEmployee = await Employee.findOne({ loginId });
    }

    const newEmployee = new Employee({
      employeeId,
      firstName,
      lastName,
      middleName,
      loginId,
      dob: new Date(dob),
      department,
      salary,
      permanentAddress,
      currentAddress,
      idProof: req.file ? req.file.path : null,
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ message: 'Error adding employee', error: err.message });
  }
};

// Get employee by ID
export const getEmployeeById = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await Employee.findOne({ employeeId });
    if (!employee) return res.status(404).send('Employee not found');
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving employee data', error: err.message });
  }
};

// Get all employees (for search)
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving employees', error: err.message });
  }
};

// Search employees by filter
export const searchEmployees = async (req, res) => {
  const { employeeId, firstName, lastName, loginId, dobStart, dobEnd, department } = req.query;

  const filter = {};

  if (employeeId) filter.employeeId = employeeId;
  if (firstName) filter.firstName = { $regex: firstName, $options: 'i' };
  if (lastName) filter.lastName = { $regex: lastName, $options: 'i' };
  if (loginId) filter.loginId = { $regex: loginId, $options: 'i' };
  
  if (dobStart || dobEnd) {
    const dobFilter = {};
    if (dobStart) dobFilter.$gte = new Date(dobStart);
    if (dobEnd) dobFilter.$lte = new Date(dobEnd);
    filter.dob = dobFilter;
  }

  if (department) filter.department = department;

  try {
    const employees = await Employee.find(filter);
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Error searching employees', error: err.message });
  }
};

// Update employee details
export const updateEmployee = async (req, res) => {
  const { employeeId } = req.params;
  const { firstName, lastName, middleName, dob, department, salary, permanentAddress, currentAddress } = req.body;

  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { employeeId },
      {
        firstName,
        lastName,
        middleName,
        dob: new Date(dob),
        department,
        salary,
        permanentAddress,
        currentAddress,
        idProof: req.file ? req.file.path : undefined,
      },
      { new: true }
    );

    if (!updatedEmployee) return res.status(404).send('Employee not found');
    res.json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ message: 'Error updating employee', error: err.message });
  }
};

// Delete employee
export   const deleteEmployee = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const deletedEmployee = await Employee.findOneAndDelete({ employeeId });
    if (!deletedEmployee) return res.status(404).send('Employee not found');
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting employee', error: err.message });
  }
};
