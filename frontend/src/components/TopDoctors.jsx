// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const TopDoctors = () => {
    const navigate = useNavigate();
    const { doctors, setDoctors } = useContext(AppContext);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch('http://localhost:5000/doctor/find-all');
                if (!response.ok) {
                    throw new Error('Failed to fetch doctors');
                }
                const data = await response.json();
                setDoctors(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchDoctors();
    }, [setDoctors]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
            {/* Căn giữa thẻ h1 */}
            <h1 className='text-3xl font-medium text-center'>Các bác sĩ hàng đầu để đặt chỗ</h1>

            {/* Căn giữa thẻ p và chỉnh sửa chiều rộng cho responsive */}
            <p className='text-center sm:w-2/3 text-sm'>Chỉ cần duyệt qua danh sách rộng lớn các bác sĩ đáng tin cậy của chúng tôi.</p>

            {/* Cấu trúc lưới cho các bác sĩ */}
            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {doctors.slice(0, 10).map((item, index) => (
                    <div
                        onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0); }}
                        className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
                        key={index}
                    >
                        <img className='bg-blue-50' src={item.user_id.image} alt={item.user_id.name} />
                        <div className='p-4'>
                            <div className='flex items-center gap-2 text-sm text-center text-green-500 text-[#00759c]'>
                                <p className='w-2 h-2 bg-[#00759c] rounded-full'></p><p>Đặt lịch</p>
                            </div>
                            <p className='text-gray-900 text-lg font-medium'>{item.user_id.name}</p>
                            <p className='text-gray-600 text-sm'>{item.specialization_id ? item.specialization_id.name : 'Chưa có chuyên khoa'}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Căn giữa nút button */}
            <button
                onClick={() => { navigate('/doctors'); scrollTo(0, 0); }}
                className='bg-blue-50 text-gray-600 px-12 py-3 hover:bg-primary hover:text-white rounded-full mt-10 mx-auto'
            >
                Tất cả
            </button>
        </div>
    );
};

export default TopDoctors;