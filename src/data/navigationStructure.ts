import {
    Home,
    FileText,
    FolderOpen,
    Calendar,
    Wrench,
    ClipboardCheck,
    MessageSquare,
    LucideIcon
} from 'lucide-react';

export interface NavItem {
    path: string;
    labelEn: string;
    labelVi: string;
    icon: LucideIcon;
    children?: NavItem[];
}

export const navigationStructure: NavItem[] = [
    {
        path: '/',
        labelEn: 'Home',
        labelVi: 'Trang chủ',
        icon: Home,
    },
    {
        path: '/worklog',
        labelEn: 'Worklog',
        labelVi: 'Nhật ký công việc',
        icon: FileText,
        children: [
            { path: '/worklog/week-1', labelEn: 'Week 1', labelVi: 'Tuần 1', icon: FileText },
            { path: '/worklog/week-2', labelEn: 'Week 2', labelVi: 'Tuần 2', icon: FileText },
            { path: '/worklog/week-3', labelEn: 'Week 3', labelVi: 'Tuần 3', icon: FileText },
            { path: '/worklog/week-4', labelEn: 'Week 4', labelVi: 'Tuần 4', icon: FileText },
            { path: '/worklog/week-5', labelEn: 'Week 5', labelVi: 'Tuần 5', icon: FileText },
            { path: '/worklog/week-6', labelEn: 'Week 6', labelVi: 'Tuần 6', icon: FileText },
            { path: '/worklog/week-7', labelEn: 'Week 7', labelVi: 'Tuần 7', icon: FileText },
            { path: '/worklog/week-8', labelEn: 'Week 8', labelVi: 'Tuần 8', icon: FileText },
            { path: '/worklog/week-9', labelEn: 'Week 9', labelVi: 'Tuần 9', icon: FileText },
            { path: '/worklog/week-10', labelEn: 'Week 10', labelVi: 'Tuần 10', icon: FileText },
            { path: '/worklog/week-11', labelEn: 'Week 11', labelVi: 'Tuần 11', icon: FileText },
            { path: '/worklog/week-12', labelEn: 'Week 12', labelVi: 'Tuần 12', icon: FileText },
        ],
    },
    {
        path: '/proposal',
        labelEn: 'Proposal',
        labelVi: 'Đề xuất',
        icon: FolderOpen,
    },
    {
        path: '/events',
        labelEn: 'Events',
        labelVi: 'Sự kiện',
        icon: Calendar,
    },
    {
        path: '/workshop',
        labelEn: 'Workshop',
        labelVi: 'Workshop',
        icon: Wrench,
        children: [
            { path: '/workshop/overview', labelEn: 'Overview', labelVi: 'Tổng quan', icon: Wrench },
            { path: '/workshop/setup', labelEn: 'Setup', labelVi: 'Thiết lập', icon: Wrench },
            { path: '/workshop/implementation', labelEn: 'Implementation', labelVi: 'Triển khai', icon: Wrench },
            { path: '/workshop/cleanup', labelEn: 'Cleanup', labelVi: 'Dọn dẹp', icon: Wrench },
        ],
    },
    {
        path: '/evaluation',
        labelEn: 'Evaluation',
        labelVi: 'Đánh giá',
        icon: ClipboardCheck,
    },
    {
        path: '/feedback',
        labelEn: 'Feedback',
        labelVi: 'Phản hồi',
        icon: MessageSquare,
    },
];
