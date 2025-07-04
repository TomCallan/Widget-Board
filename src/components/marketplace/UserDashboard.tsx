import React, { useState } from 'react';
import { 
  ArrowLeft, User, Star, Download, DollarSign, 
  TrendingUp, Package, Settings, CreditCard,
  Eye, Edit, Trash2, Plus, BarChart3
} from 'lucide-react';

interface UserDashboardProps {
  onBack: () => void;
}

type DashboardTab = 'overview' | 'widgets' | 'purchases' | 'earnings' | 'settings';

export const UserDashboard: React.FC<UserDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'widgets', label: 'My Widgets', icon: Package },
    { id: 'purchases', label: 'Purchases', icon: Download },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-purple-400" />
            <span className="text-white/70">Published Widgets</span>
          </div>
          <div className="text-2xl font-bold text-white">12</div>
          <div className="text-sm text-green-400">+2 this month</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Download className="w-5 h-5 text-blue-400" />
            <span className="text-white/70">Total Downloads</span>
          </div>
          <div className="text-2xl font-bold text-white">45.2K</div>
          <div className="text-sm text-green-400">+1.2K this month</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-white/70">Total Earnings</span>
          </div>
          <div className="text-2xl font-bold text-white">$2,847</div>
          <div className="text-sm text-green-400">+$342 this month</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-white/70">Average Rating</span>
          </div>
          <div className="text-2xl font-bold text-white">4.7</div>
          <div className="text-sm text-white/50">from 234 reviews</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { type: 'download', text: 'Weather Pro downloaded 15 times', time: '2 hours ago' },
            { type: 'review', text: 'New 5-star review for Crypto Tracker', time: '4 hours ago' },
            { type: 'sale', text: 'Weather Pro purchased for $4.99', time: '6 hours ago' },
            { type: 'update', text: 'Task Manager updated to v2.1.0', time: '1 day ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-3 py-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full" />
              <span className="text-white/70 flex-1">{activity.text}</span>
              <span className="text-white/50 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWidgets = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">My Widgets</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Submit New Widget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            name: 'Weather Pro',
            version: '2.1.0',
            downloads: 15420,
            rating: 4.7,
            earnings: '$1,247',
            status: 'active'
          },
          {
            name: 'Task Manager',
            version: '2.1.0',
            downloads: 8750,
            rating: 4.5,
            earnings: '$892',
            status: 'active'
          },
          {
            name: 'Crypto Dashboard',
            version: '1.0.0',
            downloads: 2340,
            rating: 4.2,
            earnings: '$0',
            status: 'pending'
          }
        ].map((widget, index) => (
          <div key={index} className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-white">{widget.name}</h4>
              <div className="flex gap-1">
                <button className="p-1 hover:bg-white/10 rounded">
                  <Eye className="w-4 h-4 text-white/70" />
                </button>
                <button className="p-1 hover:bg-white/10 rounded">
                  <Edit className="w-4 h-4 text-white/70" />
                </button>
                <button className="p-1 hover:bg-white/10 rounded">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Version</span>
                <span className="text-white">{widget.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Downloads</span>
                <span className="text-white">{widget.downloads.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Rating</span>
                <span className="text-white">{widget.rating} ⭐</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Earnings</span>
                <span className="text-white">{widget.earnings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Status</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  widget.status === 'active' 
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {widget.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPurchases = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Purchase History</h3>
      
      <div className="space-y-3">
        {[
          {
            name: 'Advanced Analytics Widget',
            author: 'DataViz Pro',
            price: '$9.99',
            date: '2024-01-15',
            status: 'completed'
          },
          {
            name: 'Social Media Dashboard',
            author: 'SocialDev',
            price: '$14.99',
            date: '2024-01-10',
            status: 'completed'
          },
          {
            name: 'Calendar Pro',
            author: 'TimeKeeper',
            price: '$7.99',
            date: '2024-01-05',
            status: 'refunded'
          }
        ].map((purchase, index) => (
          <div key={index} className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">{purchase.name}</h4>
                <p className="text-white/50 text-sm">by {purchase.author}</p>
              </div>
              <div className="text-right">
                <div className="font-semibold text-white">{purchase.price}</div>
                <div className="text-white/50 text-sm">{purchase.date}</div>
                <div className={`text-xs px-2 py-1 rounded mt-1 ${
                  purchase.status === 'completed' 
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {purchase.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEarnings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Earnings</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
          <CreditCard className="w-4 h-4" />
          Request Payout
        </button>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-lg p-6">
          <div className="text-white/70 mb-2">Available Balance</div>
          <div className="text-2xl font-bold text-green-400">$847.32</div>
        </div>
        <div className="bg-white/5 rounded-lg p-6">
          <div className="text-white/70 mb-2">Pending</div>
          <div className="text-2xl font-bold text-yellow-400">$156.80</div>
        </div>
        <div className="bg-white/5 rounded-lg p-6">
          <div className="text-white/70 mb-2">Total Earned</div>
          <div className="text-2xl font-bold text-white">$2,847.12</div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white/5 rounded-lg p-6">
        <h4 className="font-semibold text-white mb-4">Recent Transactions</h4>
        <div className="space-y-3">
          {[
            { type: 'sale', widget: 'Weather Pro', amount: '+$4.99', date: '2024-01-20' },
            { type: 'sale', widget: 'Task Manager', amount: '+$2.99', date: '2024-01-19' },
            { type: 'payout', widget: 'Payout to PayPal', amount: '-$500.00', date: '2024-01-15' },
            { type: 'sale', widget: 'Weather Pro', amount: '+$4.99', date: '2024-01-14' },
          ].map((transaction, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div>
                <div className="text-white">{transaction.widget}</div>
                <div className="text-white/50 text-sm">{transaction.date}</div>
              </div>
              <div className={`font-semibold ${
                transaction.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'
              }`}>
                {transaction.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Account Settings</h3>
      
      {/* Profile Settings */}
      <div className="bg-white/5 rounded-lg p-6 space-y-4">
        <h4 className="font-semibold text-white">Profile Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/70 mb-2">Display Name</label>
            <input
              type="text"
              defaultValue="John Developer"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-white/70 mb-2">Email</label>
            <input
              type="email"
              defaultValue="john@example.com"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-white/70 mb-2">Bio</label>
          <textarea
            defaultValue="Passionate widget developer creating amazing tools for productivity."
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-20"
          />
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-white/5 rounded-lg p-6 space-y-4">
        <h4 className="font-semibold text-white">Payment Methods</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-white/70" />
              <div>
                <div className="text-white">PayPal</div>
                <div className="text-white/50 text-sm">john@example.com</div>
              </div>
            </div>
            <button className="text-red-400 hover:text-red-300">Remove</button>
          </div>
          
          <button className="w-full py-2 border border-white/20 rounded-lg text-white/70 hover:bg-white/5 transition-colors">
            Add Payment Method
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white/5 rounded-lg p-6 space-y-4">
        <h4 className="font-semibold text-white">Notifications</h4>
        
        <div className="space-y-3">
          {[
            { label: 'New sales notifications', checked: true },
            { label: 'Review notifications', checked: true },
            { label: 'Marketing emails', checked: false },
            { label: 'Weekly earnings summary', checked: true },
          ].map((setting, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-white/70">{setting.label}</span>
              <input
                type="checkbox"
                defaultChecked={setting.checked}
                className="form-checkbox h-4 w-4 text-purple-500 rounded border-white/20 bg-white/5 focus:ring-purple-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'widgets':
        return renderWidgets();
      case 'purchases':
        return renderPurchases();
      case 'earnings':
        return renderEarnings();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Developer Dashboard</h2>
            <p className="text-white/50">Manage your widgets and earnings</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div>{renderContent()}</div>
    </div>
  );
};