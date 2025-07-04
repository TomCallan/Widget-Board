import React, { useState } from 'react';
import { WidgetSubmission } from '../../types/marketplace';
import { 
  ArrowLeft, Upload, Image as ImageIcon, Code, 
  DollarSign, Tag, FileText, Globe, Book, 
  Play, AlertCircle, Check
} from 'lucide-react';

interface SubmitWidgetProps {
  onBack: () => void;
  onSubmit: (submission: WidgetSubmission) => void;
}

export const SubmitWidget: React.FC<SubmitWidgetProps> = ({ onBack, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submission, setSubmission] = useState<Partial<WidgetSubmission>>({
    price: { amount: 0, currency: 'USD', type: 'free' },
    tags: [],
    screenshots: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 1, title: 'Basic Info', icon: FileText },
    { id: 2, title: 'Media & Code', icon: Code },
    { id: 3, title: 'Pricing & Links', icon: DollarSign },
    { id: 4, title: 'Review', icon: Check },
  ];

  const categories = [
    'Productivity', 'Weather', 'Finance', 'Social', 'Entertainment',
    'Tools', 'Information', 'Time & Date', 'System', 'Custom'
  ];

  const licenses = [
    'MIT', 'GPL-3.0', 'Apache-2.0', 'BSD-3-Clause', 'Commercial', 'Custom'
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!submission.name?.trim()) newErrors.name = 'Name is required';
        if (!submission.description?.trim()) newErrors.description = 'Description is required';
        if (!submission.longDescription?.trim()) newErrors.longDescription = 'Long description is required';
        if (!submission.category) newErrors.category = 'Category is required';
        if (!submission.tags?.length) newErrors.tags = 'At least one tag is required';
        break;
      case 2:
        if (!submission.icon) newErrors.icon = 'Icon is required';
        if (!submission.screenshots?.length) newErrors.screenshots = 'At least one screenshot is required';
        if (!submission.widgetCode) newErrors.widgetCode = 'Widget code file is required';
        break;
      case 3:
        if (!submission.license) newErrors.license = 'License is required';
        if (submission.price?.type === 'paid' && (!submission.price.amount || submission.price.amount <= 0)) {
          newErrors.price = 'Price must be greater than 0 for paid widgets';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSubmit(submission as WidgetSubmission);
    }
  };

  const handleFileUpload = (field: 'icon' | 'widgetCode', file: File) => {
    setSubmission(prev => ({ ...prev, [field]: file }));
  };

  const handleScreenshotUpload = (files: FileList) => {
    const newScreenshots = Array.from(files);
    setSubmission(prev => ({
      ...prev,
      screenshots: [...(prev.screenshots || []), ...newScreenshots]
    }));
  };

  const removeScreenshot = (index: number) => {
    setSubmission(prev => ({
      ...prev,
      screenshots: prev.screenshots?.filter((_, i) => i !== index) || []
    }));
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !submission.tags?.includes(tag.trim())) {
      setSubmission(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag.trim()]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setSubmission(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        
        return (
          <React.Fragment key={step.id}>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isActive 
                ? 'bg-purple-500 text-white' 
                : isCompleted 
                ? 'bg-green-500/20 text-green-400'
                : 'bg-white/5 text-white/50'
            }`}>
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-2 ${
                isCompleted ? 'bg-green-400' : 'bg-white/20'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Basic Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 mb-2">Widget Name *</label>
          <input
            type="text"
            value={submission.name || ''}
            onChange={(e) => setSubmission(prev => ({ ...prev, name: e.target.value }))}
            className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.name ? 'border-red-500' : 'border-white/20'
            }`}
            placeholder="My Awesome Widget"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <label className="block text-white/70 mb-2">Category *</label>
          <select
            value={submission.category || ''}
            onChange={(e) => setSubmission(prev => ({ ...prev, category: e.target.value }))}
            className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.category ? 'border-red-500' : 'border-white/20'
            }`}
            style={{ colorScheme: 'dark' }}
          >
            <option value="" className="bg-gray-800">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
        </div>
      </div>

      <div>
        <label className="block text-white/70 mb-2">Short Description *</label>
        <input
          type="text"
          value={submission.description || ''}
          onChange={(e) => setSubmission(prev => ({ ...prev, description: e.target.value }))}
          className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            errors.description ? 'border-red-500' : 'border-white/20'
          }`}
          placeholder="A brief description of what your widget does"
          maxLength={100}
        />
        {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
        <p className="text-white/50 text-sm mt-1">{submission.description?.length || 0}/100 characters</p>
      </div>

      <div>
        <label className="block text-white/70 mb-2">Detailed Description *</label>
        <textarea
          value={submission.longDescription || ''}
          onChange={(e) => setSubmission(prev => ({ ...prev, longDescription: e.target.value }))}
          className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 ${
            errors.longDescription ? 'border-red-500' : 'border-white/20'
          }`}
          placeholder="Provide a detailed description of your widget's features and functionality..."
        />
        {errors.longDescription && <p className="text-red-400 text-sm mt-1">{errors.longDescription}</p>}
      </div>

      <div>
        <label className="block text-white/70 mb-2">Tags *</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {submission.tags?.map(tag => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="hover:text-purple-300"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
          className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            errors.tags ? 'border-red-500' : 'border-white/20'
          }`}
          placeholder="Type a tag and press Enter"
        />
        {errors.tags && <p className="text-red-400 text-sm mt-1">{errors.tags}</p>}
        <p className="text-white/50 text-sm mt-1">Press Enter to add tags. Use relevant keywords to help users find your widget.</p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Media & Code</h3>
      
      {/* Icon Upload */}
      <div>
        <label className="block text-white/70 mb-2">Widget Icon * (PNG, SVG, 64x64px recommended)</label>
        <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
          errors.icon ? 'border-red-500' : 'border-white/20'
        }`}>
          {submission.icon ? (
            <div className="flex items-center justify-center gap-3">
              <ImageIcon className="w-6 h-6 text-green-400" />
              <span className="text-white">{submission.icon.name}</span>
              <button
                onClick={() => setSubmission(prev => ({ ...prev, icon: undefined }))}
                className="text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <ImageIcon className="w-8 h-8 text-white/50 mx-auto mb-2" />
              <p className="text-white/70">Click to upload icon</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('icon', e.target.files[0])}
                className="hidden"
              />
            </label>
          )}
        </div>
        {errors.icon && <p className="text-red-400 text-sm mt-1">{errors.icon}</p>}
      </div>

      {/* Screenshots Upload */}
      <div>
        <label className="block text-white/70 mb-2">Screenshots * (PNG, JPG, up to 5 images)</label>
        <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
          errors.screenshots ? 'border-red-500' : 'border-white/20'
        }`}>
          <label className="cursor-pointer">
            <Upload className="w-8 h-8 text-white/50 mx-auto mb-2" />
            <p className="text-white/70">Click to upload screenshots</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && handleScreenshotUpload(e.target.files)}
              className="hidden"
            />
          </label>
        </div>
        
        {submission.screenshots && submission.screenshots.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
            {submission.screenshots.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeScreenshot(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {errors.screenshots && <p className="text-red-400 text-sm mt-1">{errors.screenshots}</p>}
      </div>

      {/* Widget Code Upload */}
      <div>
        <label className="block text-white/70 mb-2">Widget Code * (ZIP file containing your widget)</label>
        <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
          errors.widgetCode ? 'border-red-500' : 'border-white/20'
        }`}>
          {submission.widgetCode ? (
            <div className="flex items-center justify-center gap-3">
              <Code className="w-6 h-6 text-green-400" />
              <span className="text-white">{submission.widgetCode.name}</span>
              <button
                onClick={() => setSubmission(prev => ({ ...prev, widgetCode: undefined }))}
                className="text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="cursor-pointer">
              <Code className="w-8 h-8 text-white/50 mx-auto mb-2" />
              <p className="text-white/70">Click to upload widget code (ZIP)</p>
              <input
                type="file"
                accept=".zip"
                onChange={(e) => e.target.files?.[0] && handleFileUpload('widgetCode', e.target.files[0])}
                className="hidden"
              />
            </label>
          )}
        </div>
        {errors.widgetCode && <p className="text-red-400 text-sm mt-1">{errors.widgetCode}</p>}
        <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-400">
              <p className="font-medium mb-1">Code Requirements:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-300">
                <li>Must export a valid WidgetConfig object</li>
                <li>Component must implement WidgetProps interface</li>
                <li>Include all necessary dependencies</li>
                <li>Follow security best practices</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Pricing & Links</h3>
      
      {/* Pricing */}
      <div className="space-y-4">
        <label className="block text-white/70 mb-2">Pricing Model</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { type: 'free', label: 'Free', desc: 'No cost to users' },
            { type: 'paid', label: 'Paid', desc: 'One-time purchase' },
            { type: 'freemium', label: 'Freemium', desc: 'Free with premium features' }
          ].map(option => (
            <button
              key={option.type}
              onClick={() => setSubmission(prev => ({
                ...prev,
                price: { ...prev.price!, type: option.type as any }
              }))}
              className={`p-4 rounded-lg border text-left transition-colors ${
                submission.price?.type === option.type
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className="font-medium text-white">{option.label}</div>
              <div className="text-sm text-white/70">{option.desc}</div>
            </button>
          ))}
        </div>
        
        {submission.price?.type === 'paid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 mb-2">Price *</label>
              <input
                type="number"
                step="0.01"
                min="0.99"
                value={submission.price.amount || ''}
                onChange={(e) => setSubmission(prev => ({
                  ...prev,
                  price: { ...prev.price!, amount: parseFloat(e.target.value) || 0 }
                }))}
                className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.price ? 'border-red-500' : 'border-white/20'
                }`}
                placeholder="9.99"
              />
              {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-white/70 mb-2">Currency</label>
              <select
                value={submission.price.currency}
                onChange={(e) => setSubmission(prev => ({
                  ...prev,
                  price: { ...prev.price!, currency: e.target.value as any }
                }))}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ colorScheme: 'dark' }}
              >
                <option value="USD" className="bg-gray-800">USD ($)</option>
                <option value="EUR" className="bg-gray-800">EUR (€)</option>
                <option value="GBP" className="bg-gray-800">GBP (£)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* License */}
      <div>
        <label className="block text-white/70 mb-2">License *</label>
        <select
          value={submission.license || ''}
          onChange={(e) => setSubmission(prev => ({ ...prev, license: e.target.value }))}
          className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            errors.license ? 'border-red-500' : 'border-white/20'
          }`}
          style={{ colorScheme: 'dark' }}
        >
          <option value="" className="bg-gray-800">Select a license</option>
          {licenses.map(license => (
            <option key={license} value={license} className="bg-gray-800">{license}</option>
          ))}
        </select>
        {errors.license && <p className="text-red-400 text-sm mt-1">{errors.license}</p>}
      </div>

      {/* Optional Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 mb-2">
            <Globe className="inline w-4 h-4 mr-1" />
            Repository URL
          </label>
          <input
            type="url"
            value={submission.repository || ''}
            onChange={(e) => setSubmission(prev => ({ ...prev, repository: e.target.value }))}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://github.com/username/widget"
          />
        </div>
        
        <div>
          <label className="block text-white/70 mb-2">
            <Book className="inline w-4 h-4 mr-1" />
            Documentation URL
          </label>
          <input
            type="url"
            value={submission.documentation || ''}
            onChange={(e) => setSubmission(prev => ({ ...prev, documentation: e.target.value }))}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://docs.example.com"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-white/70 mb-2">
            <Play className="inline w-4 h-4 mr-1" />
            Demo URL
          </label>
          <input
            type="url"
            value={submission.demo || ''}
            onChange={(e) => setSubmission(prev => ({ ...prev, demo: e.target.value }))}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://demo.example.com"
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Review & Submit</h3>
      
      <div className="bg-white/5 rounded-lg p-6 space-y-4">
        <h4 className="font-semibold text-white">Widget Summary</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-white/50">Name:</span>
            <span className="text-white ml-2">{submission.name}</span>
          </div>
          <div>
            <span className="text-white/50">Category:</span>
            <span className="text-white ml-2">{submission.category}</span>
          </div>
          <div>
            <span className="text-white/50">Price:</span>
            <span className="text-white ml-2">
              {submission.price?.type === 'free' 
                ? 'Free' 
                : `$${submission.price?.amount} ${submission.price?.currency}`}
            </span>
          </div>
          <div>
            <span className="text-white/50">License:</span>
            <span className="text-white ml-2">{submission.license}</span>
          </div>
          <div>
            <span className="text-white/50">Screenshots:</span>
            <span className="text-white ml-2">{submission.screenshots?.length || 0}</span>
          </div>
          <div>
            <span className="text-white/50">Tags:</span>
            <span className="text-white ml-2">{submission.tags?.length || 0}</span>
          </div>
        </div>
        
        <div>
          <span className="text-white/50">Description:</span>
          <p className="text-white mt-1">{submission.description}</p>
        </div>
        
        <div>
          <span className="text-white/50">Tags:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {submission.tags?.map(tag => (
              <span key={tag} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div className="text-sm text-yellow-400">
            <p className="font-medium mb-1">Review Process</p>
            <p>Your widget will be reviewed by our team within 2-3 business days. You'll receive an email notification once the review is complete.</p>
          </div>
        </div>
      </div>
    </div>
  );

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
        <h2 className="text-xl font-semibold text-white">Submit Widget</h2>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Step Content */}
      <div className="bg-white/5 rounded-lg p-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {currentStep < 4 ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            Submit for Review
          </button>
        )}
      </div>
    </div>
  );
};