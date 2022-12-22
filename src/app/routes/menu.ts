const Dashboard = {
    text: 'Dashboard',
    link: '/dashboard',
    icon: 'icon-speedometer'
};
const vendorDashboard = {
    text: 'dashboard',
    link: '/dashboard/dashboard-vendor',
    icon: 'icon-speedometer'
};
const MyOrders = {
    text: 'My Orders',
    link: '/myOrders',
    icon: 'fas fa-list',
};
const Users = {
    text: 'User Management',
    link: '/users',
    icon: 'fas fa-users'
};
const AppUsers = {
    text: 'App Management',
    link: '/users',
    icon: 'fas fa-users'
};
const Shops = {
    text: 'Stores',
    link: '/shops',
    icon: 'fas fa-shopping-cart'
};
const Products = {
    text: 'Products',
    link: '/products',
    icon: 'fas fa-list',
};
const Cities = {
    text: 'Cities',
    link: '/cities',
    icon: 'fas fa-list',
};


const Categories = {
    text: 'Categories',
    link: '/categories',
    icon: 'fas fa-sitemap',
};
const Vendors = {
    text: 'Vendor Management',
    link: '/vendors',
    icon: 'fas fa-shopping-basket',
    submenu: [

        {
            text: 'Vendors',
            link: '/vendors',

        },
        {
            text: 'Stores',
            link: '/shops',

        },
        {
            text: 'Cities',
            link: '/cities',
        },
    ]
};
const UserRoles = {
    text: 'App Users',
    link: '/roles',
    icon: 'fas fa-shopping-basket',
};
const Payments = {
    text: 'Transactions',
    link: '/orders',
    icon: 'fas fa-credit-card',
};
const FAQ = {
    text: 'FAQ',
    link: '/faq-manager/list',
    icon: 'fas fa-question-circle',
};
const HomeSections = {
    text: 'Home Sections',
    link: '/homeSections/list',
    icon: 'fas fa-question-circle',
};
const Occasion = {
    text: 'Occasion',
    link: '/occasions/list',
    icon: 'fas fa-gift',
};
const Tags = {
    text: 'Tags',
    link: '/tags',
    icon: 'fa-tags fas'
};
const System = {
    text: 'System',
    link: '/system',
    icon: 'fas fa-cogs',
    submenu: [
        {
            text: 'App Home Sections',
            link: '/homeSections/list',
        },
        {
            text: 'FAQ',
            link: '/faq-manager/list',
        }, {
            text: 'General settings',
            link: '/system/general'
        },
        // {
        //     text: 'Recycle bin',
        //     link: '/system/recycle-bin'
        // },
        {
            text: 'Filters',
            link: '/system/filters'
        },
        {
            text: 'Roles',
            link: '/system/roles-list'
        },

    ]
};

export const menu = [
    Dashboard,
    Products,

    vendorDashboard,
    Users,
    AppUsers,
    Vendors,
    // MyOrders,
    UserRoles,
    //  Shops,
    // Cities,
    Categories,
    Payments,
    //FAQ,
    // HomeSections,
    Occasion,
    Tags,
    System,

];