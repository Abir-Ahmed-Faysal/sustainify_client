import { getUserInfo } from '@/services/auth.service';
import React from 'react';

const DashboardSidebar =async () => {
const userInfo=await  getUserInfo()

const navItems :=


    return (
        <div>
            
        </div>
    );
};

export default DashboardSidebar;