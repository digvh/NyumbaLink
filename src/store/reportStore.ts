// src/store/reportStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ReportReason =
  | 'SCAM'
  | 'WRONG_INFO'
  | 'ALREADY_SOLD'
  | 'FAKE_PHOTOS'
  | 'DUPLICATE'
  | 'OFFENSIVE'
  | 'OTHER';

export interface Report {
  id: string;
  listingId: string;
  listingTitle: string;
  reason: ReportReason;
  details?: string;
  reporterId?: string;
  reporterName?: string;
  createdAt: string;
  status: 'PENDING' | 'REVIEWED' | 'DISMISSED';
}

interface ReportState {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'status'>) => void;
  getReportsForListing: (listingId: string) => Report[];
  hasReported: (listingId: string, reporterId?: string) => boolean;
}

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      reports: [],
      addReport: (r) =>
        set((s) => ({
          reports: [
            {
              ...r,
              id: `rp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
              createdAt: new Date().toISOString(),
              status: 'PENDING',
            },
            ...s.reports,
          ],
        })),
      getReportsForListing: (listingId) =>
        get().reports.filter((r) => r.listingId === listingId),
      hasReported: (listingId, reporterId) => {
        if (!reporterId) return false;
        return get().reports.some(
          (r) => r.listingId === listingId && r.reporterId === reporterId
        );
      },
    }),
    { name: 'nyumbalink-reports' }
  )
);