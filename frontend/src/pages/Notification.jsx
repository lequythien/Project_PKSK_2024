import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

// Hàm để chuyển ngày thành chuỗi định dạng 'dd-mm-yyyy'
const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${year}`;
};

// Hàm để nhóm thông báo theo ngày
const groupNotificationsByDate = (notifications) => {
  return notifications.reduce((groups, notification) => {
    const notificationDate = formatDate(notification.createdAt);
    if (!groups[notificationDate]) {
      groups[notificationDate] = [];
    }
    groups[notificationDate].push(notification);
    return groups;
  }, {});
};

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [visibleNotifications, setVisibleNotifications] = useState(7); // Giới hạn ban đầu là 7 thông báo
  const [showAll, setShowAll] = useState(false); // Kiểm tra trạng thái "Xem tất cả"
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const token = user?.token;

  if (!token) {
    navigate("/account");
    return;
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:5000/notification/find-all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Lấy thông báo thất bại");
        }
        const data = await response.json();

        const savedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
        const notificationsWithStatus = data.map((notification) => ({
          ...notification,
          read: savedNotifications.find((saved) => saved._id === notification._id)?.read || false,
        }));
        setNotifications(notificationsWithStatus);
      } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
      }
    };
    fetchNotifications();
  }, [token]);

  // Hàm xử lý khi click vào thông báo
  const toggleReadStatus = async (notificationId) => {
    const updatedNotifications = notifications.map((notification) =>
      notification._id === notificationId
        ? { ...notification, read: !notification.read }
        : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

    // Gửi yêu cầu cập nhật trạng thái đã xem trên server
    try {
      await fetch(`http://localhost:5000/show-upcoming-appointments/${notificationId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đã xem:", error);
    }
  };

  // Hàm để hiển thị thêm 3 thông báo mỗi lần bấm
  const showMoreNotifications = () => {
    setVisibleNotifications(prevVisible => prevVisible + 3); // Mỗi lần bấm sẽ hiển thị thêm 3 thông báo
  };

  // Hàm để ẩn bớt thông báo
  const hideNotifications = () => {
    setVisibleNotifications(7); // Đặt lại số thông báo hiển thị là 7
  };

  // Nhóm thông báo theo ngày và sắp xếp theo ngày (mới nhất đến cũ nhất)
  const groupedNotifications = groupNotificationsByDate(notifications);
  const notificationDates = Object.keys(groupedNotifications).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="container mx-auto p-4">
      <p className="text-2xl font-semibold mb-4">Thông báo của bạn</p>
      {notificationDates.length === 0 ? (
        <p className="text-gray-500">Không có thông báo nào.</p>
      ) : (
        notificationDates.slice(0, showAll ? notificationDates.length : visibleNotifications).map((date) => (
          <div key={date}>
            <h2 className="text-lg font-semibold mt-4">{date}</h2>
            {groupedNotifications[date].map((notification) => (
              <div
                key={notification._id}
                onClick={() => toggleReadStatus(notification._id)}
                className={`flex items-start border-b border-gray-300 py-2 cursor-pointer ${notification.read ? "text-gray-400" : "text-gray-700 font-bold"
                  }`}
              >
                <img src={assets.notification_icon} alt="Notification Icon" className="w-6 h-6 mr-3" />
                <div className="flex-1">
                  <p>{notification.content}</p>
                  <p className="text-xs text-gray-400">
                    Ca khám: {notification.new_work_shift === "morning" ? "buổi sáng" : "buổi chiều"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      {/* Nút xem thêm và ẩn bớt */}
      {visibleNotifications < notifications.length && !showAll && (
        <button
          onClick={showMoreNotifications}
          className='mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300'
        >
          Xem thêm
        </button>
      )}

      {visibleNotifications === notifications.length && (
        <button
          onClick={hideNotifications}
          className='mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300'
        >
          Ẩn bớt
        </button>
      )}
    </div>
  );
};

export default NotificationPage;
