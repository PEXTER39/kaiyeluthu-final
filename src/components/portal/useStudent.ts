import { useCallback, useEffect, useState } from "react";
import { getCurrentStudent, getEnrollment, getSubmissions, getWatchProgress, syncSession } from "@/lib/api";
import { getPlan, sessions } from "@/data/course";
import { siteConfig } from "@/config/site";
import { certificateChecklist } from "@/lib/rules";
import type { Enrollment, Student, Submission, WatchProgress } from "@/lib/types";

export function useStudent() {
  const [state, setState] = useState<{ ready: boolean; student: Student | null; enrollment: Enrollment | null; progress: WatchProgress[]; submissions: Submission[] }>({ ready: false, student: null, enrollment: null, progress: [], submissions: [] });
  const refresh = useCallback(() => {
    const student = getCurrentStudent();
    setState({
      ready: true,
      student,
      enrollment: student ? getEnrollment(student.id) : null,
      progress: student ? getWatchProgress(student.id) : [],
      submissions: student ? getSubmissions(student.id) : [],
    });
  }, []);
  useEffect(() => { refresh(); void syncSession().then(refresh); }, [refresh]);
  const plan = state.enrollment ? getPlan(state.enrollment.planId) : undefined;
  const checklist = certificateChecklist({ sessionIds: sessions.map((s) => s.id), progress: state.progress, assignments: siteConfig.assignments, submissions: state.submissions, threshold: siteConfig.watchThreshold });
  return { ...state, plan, checklist, refresh };
}
