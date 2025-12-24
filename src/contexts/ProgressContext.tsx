import React, { createContext, useContext, useState, useCallback } from 'react';
import { courseData, CourseData, Level, Module, Lesson } from '@/data/courseData';

export interface UserProgress {
  completed_lessons: string[];
  completed_modules: string[];
  quiz_scores: Record<string, number>;
  exercise_scores: Record<string, number>;
  total_points: number;
  badges: string[];
  current_level: string;
}

interface ProgressContextType {
  progress: UserProgress;
  courseData: CourseData;
  completeLesson: (lessonId: string, points: number) => void;
  completeModule: (moduleId: string) => void;
  saveQuizScore: (quizId: string, score: number) => void;
  getOverallProgress: () => number;
  getLevelProgress: (levelId: string) => number;
  getModuleProgress: (moduleId: string) => number;
  isModuleUnlocked: (levelId: string) => boolean;
  isLevelUnlocked: (levelId: string) => boolean;
}

const defaultProgress: UserProgress = {
  completed_lessons: [],
  completed_modules: [],
  quiz_scores: {},
  exercise_scores: {},
  total_points: 0,
  badges: [],
  current_level: 'beginner',
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('react-course-progress');
    return saved ? JSON.parse(saved) : defaultProgress;
  });

  const saveProgress = useCallback((newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem('react-course-progress', JSON.stringify(newProgress));
  }, []);

  const completeLesson = useCallback((lessonId: string, points: number) => {
    if (progress.completed_lessons.includes(lessonId)) return;

    const newCompletedLessons = [...progress.completed_lessons, lessonId];
    const newPoints = progress.total_points + points;
    const newBadges = [...progress.badges];

    if (newCompletedLessons.length === 1 && !newBadges.includes('first-lesson')) {
      newBadges.push('first-lesson');
    }

    saveProgress({
      ...progress,
      completed_lessons: newCompletedLessons,
      total_points: newPoints,
      badges: newBadges,
    });
  }, [progress, saveProgress]);

  const completeModule = useCallback((moduleId: string) => {
    if (progress.completed_modules.includes(moduleId)) return;

    const newCompletedModules = [...progress.completed_modules, moduleId];
    const newBadges = [...progress.badges];

    if (newCompletedModules.length === 1 && !newBadges.includes('first-module')) {
      newBadges.push('first-module');
    }

    saveProgress({
      ...progress,
      completed_modules: newCompletedModules,
      badges: newBadges,
    });
  }, [progress, saveProgress]);

  const saveQuizScore = useCallback((quizId: string, score: number) => {
    const newQuizScores = { ...progress.quiz_scores, [quizId]: score };
    const newBadges = [...progress.badges];

    if (score === 100 && !newBadges.includes('quiz-master')) {
      newBadges.push('quiz-master');
    }

    saveProgress({
      ...progress,
      quiz_scores: newQuizScores,
      badges: newBadges,
    });
  }, [progress, saveProgress]);

  const getOverallProgress = useCallback(() => {
    let totalLessons = 0;
    courseData.levels.forEach(level => {
      level.modules.forEach(module => {
        totalLessons += module.lessons.length;
      });
    });

    const completedCount = progress.completed_lessons.length;
    return totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  }, [progress]);

  const getLevelProgress = useCallback((levelId: string) => {
    const level = courseData.levels.find(l => l.id === levelId);
    if (!level) return 0;

    let totalLessons = 0;
    let completedLessons = 0;

    level.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        totalLessons++;
        if (progress.completed_lessons.includes(lesson.id)) {
          completedLessons++;
        }
      });
    });

    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  }, [progress]);

  const getModuleProgress = useCallback((moduleId: string) => {
    let totalLessons = 0;
    let completedLessons = 0;

    courseData.levels.forEach(level => {
      const module = level.modules.find(m => m.id === moduleId);
      if (module) {
        module.lessons.forEach(lesson => {
          totalLessons++;
          if (progress.completed_lessons.includes(lesson.id)) {
            completedLessons++;
          }
        });
      }
    });

    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  }, [progress]);

  const isModuleUnlocked = useCallback((levelId: string) => {
    const level = courseData.levels.find(l => l.id === levelId);
    if (!level) return false;
    return progress.total_points >= level.requiredPoints;
  }, [progress]);

  const isLevelUnlocked = useCallback((levelId: string) => {
    const level = courseData.levels.find(l => l.id === levelId);
    if (!level) return false;
    return progress.total_points >= level.requiredPoints;
  }, [progress]);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        courseData,
        completeLesson,
        completeModule,
        saveQuizScore,
        getOverallProgress,
        getLevelProgress,
        getModuleProgress,
        isModuleUnlocked,
        isLevelUnlocked,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
