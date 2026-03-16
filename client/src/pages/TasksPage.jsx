/**
 * Admin Tasks page — task list, modal form, filters
 */
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { tasksService } from '../services/api';
import DataTable from '../components/ui/DataTable';
import FilterBar from '../components/ui/FilterBar';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';
import ErrorState from '../components/ui/ErrorState';
import { TASK_STATUSES, TASK_PRIORITIES } from '../constants';
import { formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

const COLUMNS = [
  { key: 'title', label: 'Task', sortable: true },
  { key: 'related_entity_type', label: 'Related To', render: (v, row) => v ? `${v}: ${row.related_entity_id?.slice(-6)}` : '—' },
  { key: 'assigned_to', label: 'Assigned To', sortable: true },
  { key: 'priority', label: 'Priority', render: (v) => <StatusBadge status={v} /> },
  { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
  { key: 'due_date', label: 'Due', render: (v) => v ? <span className={`text-xs ${new Date(v) < new Date() ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>{formatDate(v)}</span> : '—' },
];

const EMPTY_FORM = {
  title: '',
  description: '',
  related_entity_type: '',
  related_entity_id: '',
  assigned_to: '',
  priority: 'Medium',
  status: 'Open',
  due_date: '',
};

function TasksPage() {
  const queryClient = useQueryClient();
  const { adminUser } = useAuth();
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tasks', filters, page],
    queryFn: () => tasksService.getAll({ ...filters, page, pageSize: 25 }),
    keepPreviousData: true,
  });

  const saveMutation = useMutation({
    mutationFn: (payload) =>
      editId ? tasksService.update(editId, payload) : tasksService.create(payload),
    onSuccess: () => {
      toast.success(editId ? 'Task updated' : 'Task created');
      queryClient.invalidateQueries(['tasks']);
      setShowModal(false);
      setForm(EMPTY_FORM);
      setEditId(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate({ ...form, created_by: adminUser?.id });
  };

  const handleRowClick = (row) => {
    setForm({
      title: row.title,
      description: row.description || '',
      related_entity_type: row.related_entity_type || '',
      related_entity_id: row.related_entity_id || '',
      assigned_to: row.assigned_to || '',
      priority: row.priority || 'Medium',
      status: row.status || 'Open',
      due_date: row.due_date ? row.due_date.split('T')[0] : '',
    });
    setEditId(row.id);
    setShowModal(true);
  };

  if (error) return <ErrorState message={error.message} retry={refetch} />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin Tasks</h1>
        <button onClick={() => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true); }} className="btn-primary">
          <PlusIcon className="w-4 h-4" />
          New Task
        </button>
      </div>

      <FilterBar
        filters={[
          { key: 'status', label: 'All Statuses', options: TASK_STATUSES },
          { key: 'priority', label: 'All Priorities', options: TASK_PRIORITIES },
        ]}
        values={filters}
        onChange={(k, v) => { setFilters((f) => ({ ...f, [k]: v })); setPage(1); }}
        searchKey="search"
        searchPlaceholder="Search tasks…"
      />

      <DataTable
        columns={COLUMNS}
        data={data?.data || []}
        loading={isLoading}
        onRowClick={handleRowClick}
        totalCount={data?.total}
        page={page}
        pageSize={25}
        onPageChange={setPage}
        emptyMessage="No tasks found."
      />

      {/* Task Form Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editId ? 'Edit Task' : 'New Admin Task'}
        size="md"
        footer={
          <>
            <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button
              type="submit"
              form="task-form"
              disabled={saveMutation.isPending}
              className="btn-primary"
            >
              {saveMutation.isPending ? 'Saving…' : editId ? 'Save Changes' : 'Create Task'}
            </button>
          </>
        }
      >
        <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Title *</label>
            <input
              required
              className="input mt-1"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              className="input mt-1 min-h-[80px] resize-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Priority</label>
              <select className="select mt-1" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {TASK_PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select className="select mt-1" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {TASK_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Assigned To</label>
              <input className="input mt-1" value={form.assigned_to} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Due Date</label>
              <input type="date" className="input mt-1" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Related Entity Type</label>
              <input placeholder="e.g. startup, application" className="input mt-1" value={form.related_entity_type} onChange={(e) => setForm({ ...form, related_entity_type: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Related Entity ID</label>
              <input className="input mt-1" value={form.related_entity_id} onChange={(e) => setForm({ ...form, related_entity_id: e.target.value })} />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default TasksPage;
