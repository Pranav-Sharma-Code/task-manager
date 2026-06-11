import Task from '../models/Task.js';

//                                    CREATE TASK

export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({
                message: 'Title is required'
            });
        }

        const task = await Task.create({
            title,
            description,
            status: 'pending',
            userId: req.user.id,
        });

        res.status(201).json({
            message: 'Task created successfully!',
            task,
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error: ' + error.message
        });
    }
};

//                                GET ALL TASKS 

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            count: tasks.length,
            tasks,
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error: ' + error.message
        });
    }
};

//                               GET SINGLE TASK 

export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        res.status(200).json(task);

    } catch (error) {
        res.status(500).json({
            message: 'Server error: ' + error.message
        });
    }
};

//                                    UPDATE TASK 

export const updateTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;

        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status && !['pending', 'completed'].includes(status)) {
            return res.status(400).json({
                message: 'Invalid status'
            });
        }
        if (status !== undefined) task.status = status;

        await task.save();

        res.status(200).json({
            message: 'Task updated successfully',
            task,
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error: ' + error.message
        });
    }
};

//                                                TOGGLE STATUS 

export const toggleStatus = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        task.status = task.status === 'pending' ? 'completed' : 'pending';
        await task.save();

        res.status(200).json({
            message: `Task marked as ${task.status}`,
            task,
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error: ' + error.message
        });
    }
};

//                                                  DELETE TASK 

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });

        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        res.status(200).json({
            message: 'Task deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Server error: ' + error.message
        });
    }
};