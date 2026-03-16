import { supabaseAdmin } from '../integrations/supabase.js';

// ── List tasks ─────────────────────────────────────────────────────────────
export async function list(req, res, next) {
  try {
    const { status, priority, assignedTo, page = 1, pageSize = 50 } = req.query;
    const from = (Number(page) - 1) * Number(pageSize);
    const to = from + Number(pageSize) - 1;

    let query = supabaseAdmin
      .from('admin_tasks')
      .select('*', { count: 'exact' })
      .order('due_date', { ascending: true, nullsFirst: false })
      .range(from, to);

    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);
    if (assignedTo) query = query.eq('assigned_to', assignedTo);

    // Non-super-admins only see tasks assigned to or created by them
    if (req.admin.role !== 'super_admin') {
      query = query.or(`assigned_to.eq.${req.admin.id},created_by.eq.${req.admin.id}`);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return res.json({ success: true, data, total: count, page: Number(page), pageSize: Number(pageSize) });
  } catch (err) { next(err); }
}

// ── Create task ────────────────────────────────────────────────────────────
export async function create(req, res, next) {
  try {
    const { title, description, priority, assignedTo, dueDate, relatedEntity, relatedEntityId } = req.body;
    const { data, error } = await supabaseAdmin
      .from('admin_tasks')
      .insert({
        title,
        description,
        priority: priority || 'medium',
        status: 'open',
        assigned_to: assignedTo || req.admin.id,
        created_by: req.admin.id,
        due_date: dueDate || null,
        related_entity: relatedEntity || null,
        related_entity_id: relatedEntityId || null,
      })
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
}

// ── Update task ────────────────────────────────────────────────────────────
export async function update(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_tasks')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    return res.json({ success: true, data });
  } catch (err) { next(err); }
}

// ── Delete task ────────────────────────────────────────────────────────────
export async function remove(req, res, next) {
  try {
    const { error } = await supabaseAdmin
      .from('admin_tasks')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    return res.json({ success: true });
  } catch (err) { next(err); }
}
