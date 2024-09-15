import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';

const Dashboard = () => {
    axios.defaults.withCredentials = true;

    const [isAdmin, setIsAdmin] = useState(false);
    const [errors, setErrors] = useState({});
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('all');
    const [editTask, setEditTask] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '', status: 'pending', user_id: '' });
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, [filter, search, currentPage, newTask]);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`/api/tasks`, {
                params: {
                    status: filter,
                    search: search,
                    page: currentPage
                }
            });
            setTasks(response.data.tasks.data);
            setTotalPages(response.data.tasks.last_page);
            setIsAdmin(response.data.is_admin);
            setUsers(response.data.users);
        } catch (error) {
            console.error('Task Fetch Err :', error);
        }
    };


    const handleFilterChange = (status) => {
        setFilter(status);
        setCurrentPage(1);
    };

    const handleEdit = (task) => {
        setEditTask(task);
        setNewTask({
            title: task.title,
            description: task.description,
            due_date: task.due_date,
            status: task.status,
            user_id: task.user_id
        });
        setErrors({});
        setShowModal(true);
    };

    const handleAddTask = async () => {

        try {
            await axios.post('/api/tasks', newTask);
            setNewTask({ title: '', description: '', due_date: '', user_id: '' });
            setShowModal(false);
            setErrors({});
            fetchTasks();
            toast.success('Task added successfully.');
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
        }
    };

    const handleSaveEdit = async () => {

        try {
            await axios.put(`/api/tasks/${editTask.id}`, newTask);
            setEditTask(null);
            setNewTask({ title: '', description: '', due_date: '', status: '' });
            setShowModal(false);
            setErrors({});
            fetchTasks();
            toast.success('Task updated successfully.');
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }

        }
    };

    const handleDelete = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axios.delete(`/api/tasks/${taskId}`);
                fetchTasks();
                toast.success('Task deleted successfully.');
            } catch (error) {
                console.error('Delete Task Err :', error);
            }
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: showModal ? 'block' : 'none',
        zIndex: 1040,
    };

    const today = new Date().toISOString().split('T')[0];

    const redirectToUpdateTask = () => {
        window.location.href = '/update-task-status';
    };

    return (
        <div className="container">
            <div style={overlayStyle}></div>
            <div className="row mb-3">
                <div className="mb-3 col-md-2">
                    <Form.Select aria-label="Default select example" onChange={(e) => handleFilterChange(e.target.value)}>
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </Form.Select>
                </div>


                {isAdmin && (
                    <>
                        <div className="mb-3 col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search..."
                                value={search}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="mb-3 col-md-2">
                            <button className="btn btn-success mx-2" style={{ float: 'right' }} onClick={() => { setEditTask(null); setShowModal(true); }}>Add Task</button>
                        </div>

                        <div className="mb-3 col-md-2">
                            <button className="btn btn-success mx-2" onClick={redirectToUpdateTask} style={{ float: 'right' }}>Task Status Update</button>
                        </div>
                    </>

                )}
                {!isAdmin && (
                    <>
                        <div className="mb-3 col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search..."
                                value={search}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="mb-3 col-md-3">
                            <button className="btn btn-success mx-2" onClick={redirectToUpdateTask} style={{ float: 'right' }}>Task Status Update</button>
                        </div>
                    </>

                )}

            </div>

            <table className="table table-responsive">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Task Name</th>
                        <th scope="col">Task Description</th>
                        <th scope="col">Due Date</th>
                        {
                            isAdmin && (
                                <th scope="col">Assign To User</th>
                            )
                        }
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                        <tr key={task.id}>
                            <th scope="row">{index + 1}</th>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>{task.due_date}</td>
                            {
                                isAdmin && (
                                    <td>{task.user.name}</td>
                                )
                            }
                            <td>
                                {task.status}
                            </td>
                            <td>
                                <button className="btn btn-info btn-sm mx-1" onClick={() => handleEdit(task)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Task Pagination Section */}
            {totalPages > 1 && (
                <nav>
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                        </li>
                        {[...Array(totalPages).keys()].map(page => (
                            <li key={page + 1} className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(page + 1)}>{page + 1}</button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                        </li>
                    </ul>
                </nav>
            )}

            {/* Add and Edit Task Common Modal */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} aria-labelledby="taskModel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editTask ? 'Edit Task' : 'Add Task'}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowModal(false);
                                        setNewTask({ title: '', description: '', due_date: '' });
                                        setErrors({});
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="taskTitle" className="form-label">Task Title</label>
                                    <input
                                        type="text"
                                        id="taskTitle"
                                        className="form-control"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    />
                                    {errors.title && <div className="text-danger">{errors.title}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="taskDescription" className="form-label">Task Description</label>
                                    <textarea
                                        id="taskDescription"
                                        className="form-control"
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    />
                                    {errors.description && <div className="text-danger">{errors.description}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="taskDueDate" className="form-label">Due Date</label>
                                    <input
                                        type="date"
                                        id="taskDueDate"
                                        className="form-control"
                                        value={newTask.due_date}
                                        min={today}
                                        onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                                    />
                                    {errors.due_date && <div className="text-danger">{errors.due_date}</div>}
                                </div>
                                {editTask && (
                                    <div className="mb-3">
                                        <label htmlFor="taskStatus" className="form-label">Status</label>
                                        <select
                                            className="form-control"
                                            value={newTask.status}
                                            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                        {errors.status && <div className="text-danger">{errors.status}</div>}
                                    </div>
                                )}

                                {
                                    isAdmin && (
                                        <div className="mb-3">
                                            <label htmlFor="user_id" className="form-label">Assign To User</label>
                                            <select
                                                className="form-control"
                                                value={newTask.user_id}
                                                onChange={(e) => setNewTask({ ...newTask, user_id: e.target.value })}
                                            >
                                                <option value="">Select a user</option>
                                                {users.map((user) => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.user_id && <div className="text-danger">{errors.user_id}</div>}
                                        </div>
                                    )
                                }

                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowModal(false);
                                        setNewTask({ title: '', description: '', due_date: '' });
                                        setErrors({});
                                    }}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={editTask ? handleSaveEdit : handleAddTask}
                                >
                                    {editTask ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
