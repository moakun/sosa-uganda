import Image from 'next/image';
import { formatDate } from '@/utils/format-date';
import Logo from '../public/assets/sosal.png';

interface CertificateProps {
  userName: string;
  company: string;
  date: Date;
  courseName: string;
}

export function Certificate({ userName, company, date, courseName }: CertificateProps) {
  return (
    <div className="relative w-[800px] h-[600px] bg-white p-8 mx-auto">
      {/* Border */}
      <div className="absolute inset-4 border-4 border-gray-300"></div>
      <div className="absolute inset-6 border-2 border-gray-300"></div>

      <div className="relative h-full flex flex-col items-center justify-between py-12">
        {/* Logo */}
        <div className="space-y-4">
          <Image
            src={Logo} // Replace with your actual logo path
            alt="SOGEA SATOM Logo"
            width={200}
            height={80}
            className="mx-auto"
          />
        </div>

        {/* Certificate Content */}
        <div className="space-y-8 text-center">
          <p className="text-xl text-gray-800">
            The company Sogea Satom Uganda certify that
          </p>
          <p className="text-2xl font-semibold text-gray-900">
            {userName.toUpperCase()} from the Company {company.toUpperCase()}
          </p>
          <p className="text-xl text-gray-800">
            has successfully completed the following training program:
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            {courseName}
          </h1>
        </div>

        {/* Date */}
        <div className="text-left w-full pl-12">
          <p className="text-lg">
            <span className="font-semibold">Date: </span>
            {formatDate(date)}
          </p>
        </div>
      </div>
    </div>
  );
}