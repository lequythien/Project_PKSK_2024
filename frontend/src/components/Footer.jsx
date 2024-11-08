import React from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-5 my-10 mt-40 text-sm'>

                {/* ----- Left Section ----- */}
                <div>
                    <img className='mb-5 w-28' src={assets.logo} alt="" />
                    <p className='w-full md:w-2/3 text-gray-600 leading-6'>Triple T Care cam kết hướng tới sự xuất sắc trong hoạt động thăm khám lâm sàng, đào tạo và nghiên cứu nhằm cung cấp dịch vụ chăm sóc tốt nhất. Mạng lưới chăm sóc sức khỏe của chúng tôi bao gồm hơn 2.900 giường bệnh hoạt động trên khắp 13 bệnh viện và 4 phòng khám. Trải qua 27 năm hoạt động.</p>
                </div>

                {/* ----- Center Section ----- */}
                <div>
                    <p className='text-xl font-medium mb-5'>PHÒNG KHÁM</p>
                    <ul className='flext flex-col gap-2 text-gray-600'>
                        <NavLink onClick={() => setShowMenu(false)} to='/'><li className='hover:text-[#00759c]'>Trang chủ</li></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/about'><li className='hover:text-[#00759c]'>Về chúng tôi</li></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='/contact'><li className='hover:text-[#00759c]'>Liên hệ</li></NavLink>
                        <NavLink onClick={() => setShowMenu(false)} to='#'><li className='hover:text-[#00759c]'>Chính sách bảo mật</li></NavLink>
                    </ul>
                </div>

                {/* ----- Right Section ----- */}
                    <div>
                        <p className='text-xl font-medium mb-5'>LIÊN HỆ</p>
                        <ul className='flext flex-col gap-2 text-gray-600'>
                            <li>+84-365-142-649</li>
                            <li>lequythien1@gmail.com</li>
                        </ul>
                    </div>
            </div>

            {/* ----- Copyright Text ----- */}
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 10/2024@ Prescripto - Phòng Khám Sức Khỏe.</p>
            </div>
        </div>
    )
}

export default Footer