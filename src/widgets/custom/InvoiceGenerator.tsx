import React, { useState, useEffect } from 'react';
import { WidgetConfig, WidgetProps } from '../../types/widget';
import { FileText, Plus, Trash2, Download, Eye } from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  companyName: string;
  companyAddress: string;
  clientName: string;
  clientAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
}

const InvoiceCreatorWidget: React.FC<WidgetProps> = ({ widget }) => {
  const { primaryColor, currency, companyName: defaultCompanyName, taxRate: defaultTaxRate } = widget.config;
  
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    companyName: defaultCompanyName || '',
    companyAddress: '',
    clientName: '',
    clientAddress: '',
    items: [],
    subtotal: 0,
    taxRate: defaultTaxRate || 0,
    taxAmount: 0,
    total: 0,
    notes: ''
  });

  const [showPreview, setShowPreview] = useState(false);

  // Calculate totals whenever items or tax rate changes
  useEffect(() => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = subtotal * (invoice.taxRate / 100);
    const total = subtotal + taxAmount;
    
    setInvoice(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total
    }));
  }, [invoice.items, invoice.taxRate]);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const removeItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const generatePDF = () => {
    // In a real implementation, this would generate a PDF
    const invoiceData = JSON.stringify(invoice, null, 2);
    const blob = new Blob([invoiceData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoice.invoiceNumber}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const saveInvoice = () => {
    const savedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    savedInvoices.push({ ...invoice, id: Date.now().toString() });
    localStorage.setItem('invoices', JSON.stringify(savedInvoices));
    alert('Invoice saved successfully!');
  };

  if (showPreview) {
    return (
      <div className="h-full flex flex-col bg-white text-gray-900 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Invoice Preview</h2>
          <div className="flex gap-2">
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              <Download size={16} />
              Download
            </button>
            <button
              onClick={() => setShowPreview(false)}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              Back to Edit
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
                  INVOICE
                </h1>
                <p className="text-gray-600">#{invoice.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-semibold">{invoice.companyName}</h2>
                <div className="text-gray-600 whitespace-pre-line">{invoice.companyAddress}</div>
              </div>
            </div>

            {/* Dates and Client */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-2">Bill To:</h3>
                <div className="text-gray-700">
                  <div className="font-medium">{invoice.clientName}</div>
                  <div className="whitespace-pre-line">{invoice.clientAddress}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="mb-2">
                  <span className="text-gray-600">Date: </span>
                  <span>{new Date(invoice.date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Due Date: </span>
                  <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2" style={{ borderColor: primaryColor }}>
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Qty</th>
                    <th className="text-right py-2">Rate</th>
                    <th className="text-right py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-3">{item.description}</td>
                      <td className="text-right py-3">{item.quantity}</td>
                      <td className="text-right py-3">{currency}{item.rate.toFixed(2)}</td>
                      <td className="text-right py-3">{currency}{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span>Subtotal:</span>
                  <span>{currency}{invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Tax ({invoice.taxRate}%):</span>
                  <span>{currency}{invoice.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-t-2 font-semibold text-lg" style={{ borderColor: primaryColor }}>
                  <span>Total:</span>
                  <span>{currency}{invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div>
                <h3 className="font-semibold mb-2">Notes:</h3>
                <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-accent-900 text-white overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-accent-700">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileText size={20} />
          Invoice Creator
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-3 py-1 bg-accent-600 text-white rounded text-sm hover:bg-accent-500"
          >
            <Eye size={16} />
            Preview
          </button>
          <button
            onClick={saveInvoice}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Invoice Number</label>
            <input
              type="text"
              value={invoice.invoiceNumber}
              onChange={(e) => setInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
              className="w-full px-3 py-2 bg-accent-800 border border-accent-600 rounded text-white placeholder-accent-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={invoice.date}
              onChange={(e) => setInvoice(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 bg-accent-800 border border-accent-600 rounded text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 bg-accent-800 border border-accent-600 rounded text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={invoice.taxRate}
              onChange={(e) => setInvoice(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 bg-accent-800 border border-accent-600 rounded text-white"
            />
          </div>
        </div>

        {/* Company Details */}
        <div className="space-y-2">
          <h3 className="font-semibold text-accent-200">Company Details</h3>
          <input
            type="text"
            placeholder="Company Name"
            value={invoice.companyName}
            onChange={(e) => setInvoice(prev => ({ ...prev, companyName: e.target.value }))}
            className="w-full px-3 py-2 bg-accent-800 border border-accent-600 rounded text-white placeholder-accent-400"
          />
          <textarea
            placeholder="Company Address"
            value={invoice.companyAddress}
            onChange={(e) => setInvoice(prev => ({ ...prev, companyAddress: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 bg-accent-800 border border-accent-600 rounded text-white placeholder-accent-400 resize-none"
          />
        </div>

        {/* Client Details */}
        <div className="space-y-2">
          <h3 className="font-semibold text-accent-200">Client Details</h3>
          <input
            type="text"
            placeholder="Client Name"
            value={invoice.clientName}
            onChange={(e) => setInvoice(prev => ({ ...prev, clientName: e.target.value }))}
            className="w-full px-3 py-2 bg-accent-800 border border-accent-600 rounded text-white placeholder-accent-400"
          />
          <textarea
            placeholder="Client Address"
            value={invoice.clientAddress}
            onChange={(e) => setInvoice(prev => ({ ...prev, clientAddress: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 bg-accent-800 border border-accent-600 rounded text-white placeholder-accent-400 resize-none"
          />
        </div>

        {/* Line Items */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-accent-200">Line Items</h3>
            <button
              onClick={addItem}
              className="flex items-center gap-1 px-3 py-1 bg-accent-600 hover:bg-accent-500 rounded text-sm"
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>
          
          {invoice.items.length === 0 ? (
            <div className="text-center py-8 text-accent-400">
              No items added yet. Click "Add Item" to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {invoice.items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 p-3 bg-accent-800 rounded">
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full px-2 py-1 bg-accent-700 border border-accent-600 rounded text-white placeholder-accent-400 text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-accent-700 border border-accent-600 rounded text-white text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Rate"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-accent-700 border border-accent-600 rounded text-white text-sm"
                    />
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-accent-200">{currency}{item.amount.toFixed(2)}</span>
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals */}
        {invoice.items.length > 0 && (
          <div className="bg-accent-800 p-4 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-accent-200">Subtotal:</span>
              <span className="font-medium">{currency}{invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-accent-200">Tax ({invoice.taxRate}%):</span>
              <span className="font-medium">{currency}{invoice.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t border-accent-600 pt-2">
              <span>Total:</span>
              <span>{currency}{invoice.total.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-accent-200">Notes</label>
          <textarea
            placeholder="Additional notes or payment terms..."
            value={invoice.notes}
            onChange={(e) => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 bg-accent-800 border border-accent-600 rounded text-white placeholder-accent-400 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export const invoiceCreatorWidgetConfig: WidgetConfig = {
  type: 'custom-invoice-creator',
  name: 'Invoice Creator',
  description: 'Create professional invoices with automatic calculations and PDF export.',
  version: '1.0.0',
  defaultSize: { width: 800, height: 600 },
  minSize: { width: 600, height: 400 },
  maxSize: { width: 1200, height: 800 },
  component: InvoiceCreatorWidget,
  icon: FileText,
  features: {
    resizable: true,
    fullscreenable: true,
    configurable: true,
  },
  configFields: {
    companyName: {
      type: 'text',
      label: 'Default Company Name',
      defaultValue: 'Your Company',
      description: 'The default company name to use for new invoices',
    },
    currency: {
      type: 'select',
      label: 'Currency Symbol',
      defaultValue: '$',
      options: [
        { label: 'USD ($)', value: '$' },
        { label: 'EUR (€)', value: '€' },
        { label: 'GBP (£)', value: '£' },
        { label: 'JPY (¥)', value: '¥' },
        { label: 'CAD (C$)', value: 'C$' },
        { label: 'AUD (A$)', value: 'A$' },
      ],
    },
    primaryColor: {
      type: 'color',
      label: 'Primary Color',
      defaultValue: '#3b82f6',
      description: 'The primary color used in invoice branding',
    },
    taxRate: {
      type: 'number',
      label: 'Default Tax Rate (%)',
      defaultValue: 10,
      min: 0,
      max: 100,
      description: 'The default tax rate for new invoices',
    },
  },
  categories: ['Business', 'Tools'],
  tags: ['invoice', 'billing', 'business', 'pdf', 'finance'],
  author: {
    name: 'Dash Platform',
  },
};