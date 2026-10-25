import React, { useState } from 'react';
import { User, Hash, Calendar, DollarSign, CheckCircle2, RotateCcw, AlertCircle, Send } from 'lucide-react';
import { EmployeeRegistration, FormErrors, SalaryBracket } from '../types.ts';

const FORMCARRY_ENDPOINT = 'https://formcarry.com/s/fobFfBebSNM';

const SALARY_OPTIONS: SalaryBracket[] = [
  '20 to 30 k',
  '31 to 40k',
  '41k plus',
];

export const RegistrationForm: React.FC = () => {
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [age, setAge] = useState('');
  const [salaryBracket, setSalaryBracket] = useState<SalaryBracket | ''>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<EmployeeRegistration | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!employeeId.trim()) {
      newErrors.employeeId = 'Please enter your employee ID';
    }

    const numericAge = parseInt(age, 10);
    if (!age.trim()) {
      newErrors.age = 'Please enter your age';
    } else if (isNaN(numericAge) || numericAge <= 0) {
      newErrors.age = 'Please enter a valid age';
    }

    if (!salaryBracket) {
      newErrors.salaryBracket = 'Please select a salary bracket';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: name.trim(),
      employeeId: employeeId.trim(),
      age: parseInt(age, 10),
      salaryBracket: salaryBracket as SalaryBracket,
      submittedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(FORMCARRY_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      setSubmittedData({
        name: payload.name,
        employeeId: payload.employeeId,
        age: payload.age,
        salaryBracket: payload.salaryBracket,
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError('Unable to send response to Formcarry. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmployeeId('');
    setAge('');
    setSalaryBracket('');
    setErrors({});
    setSubmitError(null);
    setSubmittedData(null);
  };

  if (submittedData) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 mb-6">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <h2 className="text-base font-semibold">Registration Submitted</h2>
            <p className="text-xs text-emerald-700">
              Your details have been successfully recorded and sent to Formcarry.
            </p>
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 text-sm mb-6">
          <div className="flex justify-between items-center py-3 px-4">
            <span className="text-slate-500 text-xs">Name</span>
            <span className="font-semibold text-slate-900">{submittedData.name}</span>
          </div>
          <div className="flex justify-between items-center py-3 px-4 bg-slate-50/50">
            <span className="text-slate-500 text-xs">Employee ID</span>
            <span className="font-mono font-semibold text-slate-900">{submittedData.employeeId}</span>
          </div>
          <div className="flex justify-between items-center py-3 px-4">
            <span className="text-slate-500 text-xs">Age</span>
            <span className="font-semibold text-slate-900">{submittedData.age}</span>
          </div>
          <div className="flex justify-between items-center py-3 px-4 bg-slate-50/50">
            <span className="text-slate-500 text-xs">Salary Bracket</span>
            <span className="font-semibold text-blue-700">{submittedData.salaryBracket}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Submit Another Response</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          NCS Registration Form
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Please provide your details below and click submit.
        </p>
      </div>

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold">Submission failed</p>
            <p className="mt-0.5 text-red-700">{submitError}</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        action={FORMCARRY_ENDPOINT}
        method="POST"
        noValidate
        className="space-y-6"
      >
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-slate-900 mb-1.5"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }
              }}
              className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.name
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
              }`}
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* Employee ID */}
        <div>
          <label
            htmlFor="employeeId"
            className="block text-sm font-semibold text-slate-900 mb-1.5"
          >
            Employee ID <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="employeeId"
              name="employeeId"
              type="text"
              placeholder="Enter employee ID"
              value={employeeId}
              onChange={(e) => {
                setEmployeeId(e.target.value);
                if (errors.employeeId) {
                  setErrors((prev) => ({ ...prev, employeeId: undefined }));
                }
              }}
              className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.employeeId
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
              }`}
            />
          </div>
          {errors.employeeId && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.employeeId}</span>
            </p>
          )}
        </div>

        {/* Age */}
        <div>
          <label
            htmlFor="age"
            className="block text-sm font-semibold text-slate-900 mb-1.5"
          >
            Age <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="age"
              name="age"
              type="number"
              min="1"
              max="120"
              placeholder="Enter age"
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
                if (errors.age) {
                  setErrors((prev) => ({ ...prev, age: undefined }));
                }
              }}
              className={`w-full sm:w-48 pl-9 pr-3.5 py-2.5 rounded-lg border text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.age
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                  : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
              }`}
            />
          </div>
          {errors.age && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.age}</span>
            </p>
          )}
        </div>

        {/* Salary Bracket */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Salary Bracket <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SALARY_OPTIONS.map((bracket) => {
              const isSelected = salaryBracket === bracket;
              return (
                <label
                  key={bracket}
                  className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="salaryBracket"
                    value={bracket}
                    checked={isSelected}
                    onChange={() => {
                      setSalaryBracket(bracket);
                      if (errors.salaryBracket) {
                        setErrors((prev) => ({ ...prev, salaryBracket: undefined }));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm font-medium text-slate-900">
                      {bracket}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
          {errors.salaryBracket && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.salaryBracket}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};
