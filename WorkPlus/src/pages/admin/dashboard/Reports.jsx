import React from 'react';
import { FileText, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';

const ReportCard = ({ title, description, icon: Icon, status, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    red: 'bg-red-500/20 text-red-400',
    purple: 'bg-purple-500/20 text-purple-400',
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'good':
        return <span className="text-green-400">●</span>;
      case 'warning':
        return <span className="text-yellow-400">●</span>;
      case 'critical':
        return <span className="text-red-400">●</span>;
      default:
        return <span className="text-gray-400">●</span>;
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300 group cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex items-center space-x-1">
          {getStatusIcon()}
          <span className="text-xs text-gray-400 capitalize">{status}</span>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 mb-4">{description}</p>

      <div className="flex items-center justify-between">
        <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
          View Report →
        </button>
        <span className="text-xs text-gray-500">Updated 2h ago</span>
      </div>
    </div>
  );
};

const Reports = () => {
  const reports = [
    {
      title: 'Weekly Performance',
      description: 'Detailed insights into your weekly campaign performance and growth metrics.',
      icon: TrendingUp,
      status: 'good',
      color: 'green',
    },
    {
      title: 'Engagement Analysis',
      description: 'Comprehensive breakdown of audience engagement across all platforms.',
      icon: BarChart3,
      status: 'warning',
      color: 'blue',
    },
    {
      title: 'Risk Assessment',
      description: 'Identifies potential risks and areas of concern in your current strategy.',
      icon: AlertTriangle,
      status: 'critical',
      color: 'red',
    },
    {
      title: 'Content Report',
      description: 'Analysis of your content performance and recommendations for improvement.',
      icon: FileText,
      status: 'good',
      color: 'purple',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Reports & Insights</h1>
          <p className="text-gray-400">Comprehensive analytics and performance reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report, index) => (
            <ReportCard key={index} {...report} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
