export type GeneralConfig = {
  companyName: string;
  basePath: string;
};

export type NavBarConfig = {
  discordLink: string;
  navbarButtonText: string;
  navbarButtonLink: string;
  logoLink: string;
};

export type WorkshopStep = {
  title: string;
  text: string;
  slug: string; // Added slug for routing
};

export type MainPageConfig = {
  mainTitle: string;
  subTitle: string;
  heroText: string;
  heroButtonText: string;
  heroButtonLink: string;
  workshopSummarySteps: WorkshopStep[];
};

export type StepData = {
  id: number;
  title: string;
  file?: string;
  content?: string;
};

export type Prerequisite = {
  text: string;
};

export type StepsPageConfig = {
  stepsData: StepData[];
  prerequisites: Prerequisite[];
};

// New types for lab configuration
export type LabConfig = {
  id: string;
  title: string;
  description: string;
  prerequisites: Prerequisite[];
  steps: StepData[];
};

export type Step = {
  id: number;
  title: string;
  content: string | void;
};