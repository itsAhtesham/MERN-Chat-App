import {createAsyncThunk} from "@reduxjs/toolkit";
import {server} from "../../constants/config.js";
import axios from "axios";

const adminLogin = createAsyncThunk("admin/login", async (secretKey) => {
    try {
        const config = {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const { data } = await axios.post(`${server}/admin/verify`, { secretKey }, config);

        return data.message;
    } catch (e) {
        throw e.response?.data?.message || "Something went wrong";
    }
});

const getAdmin = createAsyncThunk("admin/getAdmin", async () => {
    try {
        const { data } = await axios.get(`${server}/admin/`, {withCredentials: true});

        return data.admin;
    } catch (e) {
        throw e.response?.data?.message || "Something went wrong";
    }
});

const adminLogout = createAsyncThunk("admin/logout", async () => {
    try {
        const { data } = await axios.get(`${server}/admin/logout`, {withCredentials: true});

        return data.message;
    } catch (e) {
        throw e.response?.data?.message || "Something went wrong";
    }
});

export {
    adminLogin,
    getAdmin,
    adminLogout,
}