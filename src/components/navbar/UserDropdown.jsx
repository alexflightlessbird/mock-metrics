import React, { memo, Suspense, useState } from "react";
import Dropdown from "antd/es/dropdown";
import Avatar from "antd/es/avatar";
import Spin from "antd/es/spin";
import { useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

function UserDropdown ({ supabase }) {
    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Logout failed:", error);
            window.alert("Something went wrong. Please try again.");
        } finally {
            setLoggingOut(false);
            navigate("/", { replace: true });
        }
    }

    const items = [
        {
            key: '1',
            label: <span onClick={() => navigate('/settings')}>Settings</span>
        },
        {
            key: '2',
            label: <span onClick={handleLogout}>Logout</span>
        }
    ]

    return (
        <>
            {loggingOut && <Spin fullscreen tip="logging you out..." delay={500} />}
            <Dropdown menu={{ items }} trigger={['click', 'hover']} placement="bottom">
                <Avatar 
                    style={{ cursor: 'pointer' }} 
                    icon={<UserOutlined/>} 
                    size={50}
                    draggable={false}
                    className="avatar"
                    />
            </Dropdown>
        </>
    )
}

export default memo(UserDropdown);