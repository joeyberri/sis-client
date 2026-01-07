import { BaseApiClient } from './base-client';

// Fees type definitions
export interface FeeStructure {
  id: string;
  name: string;
  description?: string;
  amount: number;
  type: 'tuition' | 'transport' | 'meals' | 'activity' | 'exam' | 'other';
  frequency: 'one-time' | 'monthly' | 'quarterly' | 'annually';
  academicYearId: string;
  grade?: string;
  dueDate?: string;
  isActive: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FeePayment {
  id: string;
  studentId: string;
  feeStructureId?: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'bank-transfer' | 'check' | 'online';
  reference?: string;
  notes?: string;
  paymentDate: string;
  processedBy: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at?: string;
  updated_at?: string;
}

export interface Invoice {
  id: string;
  studentId: string;
  feeStructureId: string;
  amount: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  sentDate?: string;
  paidDate?: string;
  paymentId?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StudentFeeStatus {
  studentId: string;
  studentName: string;
  totalDue: number;
  totalPaid: number;
  balance: number;
  overdueAmount: number;
  nextDueDate?: string;
  paymentHistory: FeePayment[];
  outstandingInvoices: Invoice[];
}

export interface FeeCollectionSummary {
  academicYearId?: string;
  termId?: string;
  totalExpected: number;
  totalCollected: number;
  totalOutstanding: number;
  collectionRate: number;
  byGrade: Array<{
    grade: string;
    expected: number;
    collected: number;
    outstanding: number;
    rate: number;
  }>;
  byMonth: Array<{
    month: string;
    collected: number;
    count: number;
  }>;
}

export class FeesApiClient extends BaseApiClient {
  // ============ FEE STRUCTURES ============

  // Get all fee structures
  async getFeeStructures(params?: {
    academicYearId?: string;
    grade?: string;
    type?: string;
    isActive?: boolean;
  }) {
    return this.get<{ success: boolean; data: FeeStructure[] }>(
      '/api/fees/structures',
      params
    );
  }

  // Get a single fee structure
  async getFeeStructure(id: string) {
    return this.get<{ success: boolean; data: FeeStructure }>(
      `/api/fees/structures/${id}`
    );
  }

  // Create a new fee structure
  async createFeeStructure(data: {
    name: string;
    description?: string;
    amount: number;
    type: 'tuition' | 'transport' | 'meals' | 'activity' | 'exam' | 'other';
    frequency: 'one-time' | 'monthly' | 'quarterly' | 'annually';
    academicYearId: string;
    grade?: string;
    dueDate?: string;
  }) {
    return this.post<{ success: boolean; data: FeeStructure }>(
      '/api/fees/structures',
      data
    );
  }

  // Update a fee structure
  async updateFeeStructure(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      amount: number;
      type: string;
      frequency: string;
      grade: string;
      dueDate: string;
      isActive: boolean;
    }>
  ) {
    return this.put<{ success: boolean; data: FeeStructure }>(
      `/api/fees/structures/${id}`,
      data
    );
  }

  // Delete a fee structure
  async deleteFeeStructure(id: string) {
    return this.delete<{ success: boolean; message: string }>(
      `/api/fees/structures/${id}`
    );
  }

  // ============ FEE PAYMENTS ============

  // Get all fee payments
  async getFeePayments(params?: {
    studentId?: string;
    feeStructureId?: string;
    status?: string;
    paymentMethod?: string;
    startDate?: string;
    endDate?: string;
    processedBy?: string;
  }) {
    return this.get<{ success: boolean; data: FeePayment[] }>(
      '/api/fees/payments',
      params
    );
  }

  // Record a fee payment
  async recordFeePayment(data: {
    studentId: string;
    feeStructureId?: string;
    amount: number;
    paymentMethod: 'cash' | 'card' | 'bank-transfer' | 'check' | 'online';
    reference?: string;
    notes?: string;
  }) {
    return this.post<{ success: boolean; data: FeePayment }>(
      '/api/fees/payments',
      data
    );
  }

  // Update payment status
  async updatePaymentStatus(
    paymentId: string,
    status: 'pending' | 'completed' | 'failed' | 'refunded'
  ) {
    return this.patch<{ success: boolean; data: FeePayment }>(
      `/api/fees/payments/${paymentId}`,
      { status }
    );
  }

  // ============ INVOICES ============

  // Get all invoices
  async getInvoices(params?: {
    studentId?: string;
    feeStructureId?: string;
    status?: string;
    overdue?: boolean;
    startDate?: string;
    endDate?: string;
  }) {
    return this.get<{ success: boolean; data: Invoice[] }>('/invoices', params);
  }

  // Get a single invoice
  async getInvoice(id: string) {
    return this.get<Invoice>(`/invoices/${id}`);
  }

  // Create an invoice
  async createInvoice(data: {
    studentId: string;
    feeStructureId: string;
    dueDate: string;
  }) {
    return this.post<Invoice>('/invoices', data);
  }

  // Send invoice to parent/student
  async sendInvoice(invoiceId: string) {
    return this.post<{ success: boolean; message: string }>(
      `/invoices/${invoiceId}/send`
    );
  }

  // Mark invoice as paid
  async markInvoicePaid(invoiceId: string) {
    return this.patch<{ success: boolean; data: Invoice }>(
      `/invoices/${invoiceId}/mark-paid`
    );
  }

  // Update invoice
  async updateInvoice(
    id: string,
    data: Partial<{
      dueDate: string;
      status: string;
    }>
  ) {
    return this.put<Invoice>(`/invoices/${id}`, data);
  }

  // Delete/cancel invoice
  async deleteInvoice(id: string) {
    return this.delete<{ success: boolean; message: string }>(
      `/invoices/${id}`
    );
  }

  // ============ STUDENT FEE STATUS ============

  // Get student fee status
  async getStudentFeeStatus(studentId: string, academicYearId?: string) {
    return this.get<{ success: boolean; data: StudentFeeStatus }>(
      `/api/fees/students/${studentId}/status`,
      { academicYearId }
    );
  }

  // Get fee collection summary
  async getFeeCollectionSummary(params?: {
    academicYearId?: string;
    termId?: string;
  }) {
    return this.get<{ success: boolean; data: FeeCollectionSummary }>(
      '/api/fees/collection-summary',
      params
    );
  }

  // ============ LEGACY COMPATIBILITY ============

  // Legacy fee endpoints (keeping for backwards compatibility)
  async getFees(params?: any) {
    return this.get('/fees', params);
  }

  async reconcilePayment(paymentId: string) {
    return this.patch(`/payments/${paymentId}/reconcile`);
  }

  async cancelPayment(paymentId: string) {
    return this.patch(`/payments/${paymentId}/cancel`);
  }
}
