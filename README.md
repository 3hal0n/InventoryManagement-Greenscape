# 🧰 Item Inventory & Maintenance Management System

A full-stack web application for efficient inventory tracking, usage logging, and maintenance management. Built for modern organizations, it streamlines asset handling with real-time alerts, interactive 3D models, and exportable reports — all within a secure, role-based environment.

---

## 🚀 Features

### 🔐 Authentication & Role-Based Access
- Secure JWT-based login/registration
- Role-based access: **Admin**, **Manager**, **Employee**
- Customized dashboard views and permissions per role

### 📦 Inventory Management
- Add, update, and delete items
- Track quantities, categories, suppliers, and reorder thresholds

### 📉 Stock Monitoring
- Real-time stock level tracking
- Configurable low-stock alerts

### 📝 Usage Reporting
- Log item usage with project name, purpose, and date
- Search/filter logs and export as **CSV** or **PDF**

### 🛠️ Maintenance Logs
- Record maintenance events
- Schedule future maintenance
- Track costs and history per item

### 📬 Notifications
- Alerts for low-stock items and maintenance due

### 📊 Data Visualization
- Realtime inventory and usage charts with **Chart.js** and **Recharts**

### 🖼️ 3D Model Integration
- Upload and interact with `.glb` or `.gltf` inventory models
- Rotate, zoom, and pan in a live preview

### 📄 Export Support
- Generate downloadable reports (Inventory, Usage, Maintenance) in PDF/CSV

### 📱 Responsive UI
- Optimized for desktops, tablets, and mobile devices

---

## 🛠 Tech Stack

**Frontend**  
- React.js  
- Chart.js, Recharts  
- Three.js (for 3D models)  
- CSS  

**Backend**  
- Node.js  
- Express.js  

**Database**  
- MongoDB (NoSQL)

**Authentication**  
- JWT (JSON Web Tokens)

**PDF Generation**  
- jsPDF  
- jsPDF-AutoTable

---

## 👥 Roles & Permissions

| Role        | Permissions                                                                 |
|-------------|------------------------------------------------------------------------------|
| **Admin**   | Full access to all features (users, inventory, usage, maintenance, reports) |
| **Manager** | Manage inventory, usage, maintenance, and view/export reports               |
| **Employee**| View inventory, submit usage logs, limited maintenance access               |

> 🔒 Only **Admins** can manage user roles.  
> 📝 Only **Admins** and **Managers** can add/edit/delete usage or maintenance logs.

---

## 🖼️ 3D Model Viewer

- Upload `.glb` / `.gltf` files for assets like machinery or tools  
- Supports rotation, zoom, and interactive inspection  
- Helps technicians and managers visualize physical assets in detail

---

