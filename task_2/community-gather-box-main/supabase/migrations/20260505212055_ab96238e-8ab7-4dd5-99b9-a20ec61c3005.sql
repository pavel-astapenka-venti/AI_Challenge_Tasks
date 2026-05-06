DROP POLICY IF EXISTS "Feedback visible to hosts and self" ON public.event_feedback;
CREATE POLICY "Feedback publicly viewable"
ON public.event_feedback FOR SELECT
USING (true);