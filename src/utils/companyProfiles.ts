import { resolveBrandDomain } from '../components/BrandAvatar';
import { REFERRAL_URLS, resolveApplyUrl } from './referralLinks';
import type { CareerPrepPayload } from './careerPrepTemplates';
import { getRoleBundleById, type RoleBundleId } from './roleBundles';

export interface CompanyKitProfile {
  company: string;
  domain: string;
  roleTitle: string;
  payBand: string;
  location: string;
  contractType: string;
  applyUrl: string;
  whatTheyBuild: string;
  companyBackground: string;
  screeningFormat: string;
  rubricExpectations: string[];
  video: {
    youtubeId: string;
    customVideoUrl?: string;
    title: string;
    instructor: string;
    duration: string;
    takeaways: string[];
  };
}

interface VerifiedCompanySeed {
  domain: string;
  companyBackground: string;
  whatTheyBuild: string;
  screeningFormat: string;
  rubricExpectations: string[];
  defaultApplyUrl: string;
}

const VERIFIED_COMPANY_DIRECTORY: Record<string, VerifiedCompanySeed> = {
  micro1: {
    domain: 'micro1.ai',
    companyBackground:
      'San Francisco–based AI engineering talent platform vetting distributed software, ML, and domain specialists globally with transparent USD contracts.',
    whatTheyBuild:
      'Automated AI technical screening workflows, curated developer marketplaces, and enterprise engineering evaluation teams for high-growth AI startups.',
    screeningFormat:
      '5-minute async AI technical voice/video screen + system trade-offs & production debugging rubric.',
    rubricExpectations: [
      'Articulate system trade-offs (latency, caching, state management, database indexing) with concrete before/after metrics.',
      'Use crisp first-person ownership ("I profiled...", "I shipped...") rather than vague team summaries.',
      'Speak calmly at 135–155 WPM in a quiet room so automated speech grading captures technical terms accurately.',
    ],
    defaultApplyUrl: REFERRAL_URLS.micro1,
  },
  mercor: {
    domain: 'mercor.com',
    companyBackground:
      'Frontier AI talent and expert evaluation network connecting senior engineers, researchers, lawyers, clinicians, and financial analysts with top AI research labs.',
    whatTheyBuild:
      'Expert human-intelligence pipelines, multi-step reasoning benchmarks, and specialized SWE & domain evaluation sprints.',
    screeningFormat:
      '20-minute structured AI conversational interview evaluating depth of domain judgment and quantified STAR stories.',
    rubricExpectations: [
      'Demonstrate deep boundary-case reasoning rather than textbook high-level definitions.',
      'Quantify production impact (latency reduced, accuracy lifted, edge cases isolated) in every behavioral response.',
      'Author verifiable, unambiguous rubric rules that catch silent model hallucinations.',
    ],
    defaultApplyUrl: REFERRAL_URLS.mercor,
  },
  outlier: {
    domain: 'outlier.ai',
    companyBackground:
      'Global expert contributor network operated alongside Scale AI connecting STEM, coding, and analytical specialists to frontier LLM post-training queues.',
    whatTheyBuild:
      'High-signal RLHF preference datasets, Side-by-Side model critiques, and instruction-following calibration pipelines.',
    screeningFormat:
      'Timed domain qualification assessment + Side-by-Side completion ranking & policy justification audit.',
    rubricExpectations: [
      'Verify every math step, factual claim, and code snippet independently before grading a completion truthful.',
      'Audit negative constraints first—never let polished, verbose prose mask missing formatting or banned library violations.',
      'Write concise, quote-backed rationales citing exact divergences between Model A and Model B.',
    ],
    defaultApplyUrl: 'https://outlier.ai',
  },
  'outlier ai': {
    domain: 'outlier.ai',
    companyBackground:
      'Global expert contributor network operated alongside Scale AI connecting STEM, coding, and analytical specialists to frontier LLM post-training queues.',
    whatTheyBuild:
      'High-signal RLHF preference datasets, Side-by-Side model critiques, and instruction-following calibration pipelines.',
    screeningFormat:
      'Timed domain qualification assessment + Side-by-Side completion ranking & policy justification audit.',
    rubricExpectations: [
      'Verify every math step, factual claim, and code snippet independently before grading a completion truthful.',
      'Audit negative constraints first—never let polished, verbose prose mask missing formatting or banned library violations.',
      'Write concise, quote-backed rationales citing exact divergences between Model A and Model B.',
    ],
    defaultApplyUrl: 'https://outlier.ai',
  },
  'scale ai': {
    domain: 'scale.com',
    companyBackground:
      'Leading AI data infrastructure partner supplying evaluation benchmarks, safety red-teaming, and post-training datasets to frontier labs and enterprises.',
    whatTheyBuild:
      'Enterprise RLHF pipelines, SWE-bench coding tasks, adversarial safety evaluation harnesses, and multimodal annotation infrastructure.',
    screeningFormat:
      'Structured domain benchmark test + diagnostic rubric authoring and inter-annotator calibration review.',
    rubricExpectations: [
      'Decompose complex prompts into atomic, binary-verifiable grading criteria.',
      'Deliver minimal, reproducible counterexamples and verified execution traces for coding/STEM tasks.',
      'Maintain >= 92% reviewer agreement across multi-turn edge cases.',
    ],
    defaultApplyUrl: 'https://scale.com/careers',
  },
  'babel audio': {
    domain: 'babel.audio',
    companyBackground:
      'Specialized conversational speech data platform partnering with frontier audio AI teams on natural multilingual dialogue datasets.',
    whatTheyBuild:
      'Studio-clean multi-speaker speech corpora, prosody benchmarks, and multilingual voice synthesis training sets.',
    screeningFormat:
      '1-minute room-tone & acoustic mic audition evaluated automatically for noise floor (-55 dBFS) and natural cadence.',
    rubricExpectations: [
      'Record inside a quiet, low-reverb setup achieving unweighted room tone below -55 to -60 dBFS.',
      'Disable laptop software noise suppression so consonant endings remain natural and uncompressed.',
      'Maintain organic conversational tone without forced announcer exaggeration.',
    ],
    defaultApplyUrl: REFERRAL_URLS.babel,
  },
  spout: {
    domain: 'withspout.com',
    companyBackground:
      'Remote conversational audio and voice AI contributor network paying worldwide speakers for natural dialogue and speech evaluation tasks.',
    whatTheyBuild:
      'Real-world multi-speaker audio recordings, pronunciation audits, and conversational AI speech datasets.',
    screeningFormat:
      'Quick browser microphone clarity check + guided conversational sample read.',
    rubricExpectations: [
      'Keep input levels cleanly between -12 dBFS and -6 dBFS with zero mic clipping.',
      'Ensure zero background fans, street noise, or room echo during prompt sessions.',
      'Follow conversational turn-taking guidelines cleanly with steady pacing.',
    ],
    defaultApplyUrl: REFERRAL_URLS.spout,
  },
  visora: {
    domain: 'visora.com',
    companyBackground:
      'Distributed multimodal AI annotation platform focused on video understanding, spatial reasoning, and visual preference evaluation.',
    whatTheyBuild:
      'Temporal video segmentation labels, multimodal reasoning datasets, and vision-language QA benchmarks.',
    screeningFormat:
      'Visual accuracy calibration quiz + structured timeline tagging sample task.',
    rubricExpectations: [
      'Anchor frame timestamps and bounding reasoning strictly to visible video evidence.',
      'Flag ambiguous lighting, occlusion, or edge frames explicitly in task notes.',
      'Maintain high consistency across multi-step multimodal QA rubrics.',
    ],
    defaultApplyUrl: REFERRAL_URLS.visora,
  },
  anthropic: {
    domain: 'anthropic.com',
    companyBackground:
      'AI safety and research company building reliable, interpretable, and steerable frontier AI systems.',
    whatTheyBuild:
      'Claude foundation models, agentic coding workflows, constitutional alignment systems, and developer APIs.',
    screeningFormat:
      'Portfolio & prompt architecture review + structured behavioral, coding, and alignment evaluation rounds.',
    rubricExpectations: [
      'Demonstrate empirical prompt engineering with golden test suites, structured outputs, and refusal calibration.',
      'Write clear, concise async specifications documenting failure modes and mitigations.',
      'Prioritize safety, factual grounding, and measurable reliability over flashy demos.',
    ],
    defaultApplyUrl: 'https://www.anthropic.com/careers',
  },
};

function selectVideoForProfile(
  bundleId: RoleBundleId,
  companyLower: string,
  customVideoUrl?: string
): CompanyKitProfile['video'] {
  if (customVideoUrl) {
    return {
      youtubeId: 'jPKTo1iGQiE',
      customVideoUrl,
      title: 'Featured Company Role & Screening Walkthrough',
      instructor: 'Employer Spotlight',
      duration: 'Spotlight',
      takeaways: [
        'Note the exact technical stack, daily deliverable cadence, and timezone expectations highlighted in the spotlight.',
        'Mirror the team’s priority outcomes directly in your tailored executive summary and first two experience bullets.',
        'Prepare one concrete 90-second STAR example proving independent remote ownership.',
      ],
    };
  }

  if (companyLower.includes('mercor')) {
    return {
      youtubeId: 'd2AnPgnCNZM',
      title: 'The STAR Framework: Nail Your AI Conversational & Behavioral Screen',
      instructor: 'Aced (Exponent)',
      duration: '12 min',
      takeaways: [
        'Keep Situation & Task setup under 25% of speaking time so evaluators spend most of the rubric on your Actions and Results.',
        'Replace team-level phrasing ("we built") with crisp individual ownership ("I authored...", "I benchmarked...").',
        'Anchor every Result in verifiable numbers (accuracy gain, latency drop, rubric agreement, or hours saved).',
        'Speak steadily at 135–155 WPM so AI screening transcripts capture domain terms cleanly.',
      ],
    };
  }

  if (bundleId === 'voice-ai') {
    return {
      youtubeId: 'CZ7cLoZzVoY',
      title: 'Acoustic Treatment Secret For Studio-Clean Voice AI Auditions',
      instructor: 'Lenny B',
      duration: '8 min',
      takeaways: [
        'Treating nearby wall and desk reflections removes room slap-back far more reliably than software noise gates.',
        'Verify 5 seconds of silent room tone sits below -55 to -60 dBFS before submitting your audition file.',
        'Angle your microphone 30 degrees off-axis 4–6 inches away to eliminate harsh plosives naturally.',
        'Read at a relaxed, authentic conversational pace around 145 WPM.',
      ],
    };
  }

  if (bundleId === 'prompt-llm') {
    return {
      youtubeId: '8ib4Qnh2HFE',
      title: 'Systematic AI Prompting Workflows, Delimiters & Reasoning Patterns',
      instructor: 'DeepLearning.AI (Andrew Ng)',
      duration: '45 min',
      takeaways: [
        'Separate static instructions from variable payloads using XML delimiters for safer, cache-friendly prompts.',
        'Enforce strict JSON schemas and explicit null/refusal fallbacks so downstream parsers never silently break.',
        'Treat prompt edits like code releases—verify every change against 20–50 golden edge-case examples.',
        'Require explicit intermediate verification steps before scoring or summarizing complex source text.',
      ],
    };
  }

  if (bundleId === 'ai-software') {
    return {
      youtubeId: 'jPKTo1iGQiE',
      title: 'System Design & Technical Trade-Offs Walkthrough',
      instructor: 'NeetCode',
      duration: '22 min',
      takeaways: [
        'Scope functional constraints, scale assumptions, and latency targets in the first 4 minutes before diving into implementation.',
        'Separate metadata control paths from heavy compute/media pipelines and state why you chose each storage tier.',
        'Proactively call out bottlenecks, retry idempotency, and caching invalidation before the interviewer asks.',
        'Pair every architectural claim with real production metrics you personally measured.',
      ],
    };
  }

  return {
    youtubeId: 'T_X4XFwKX8k',
    title: 'Reinforcement Learning from Human Feedback (RLHF) & Rubric Evaluation',
    instructor: 'IBM Technology',
    duration: '9 min',
    takeaways: [
      'Understand how human Side-by-Side (SxS) rankings train reward models to separate helpful accuracy from confident fluff.',
      'Check negative constraints (formatting, length limits, banned tools) before scoring helpfulness or style.',
      'Structure written rationales around exact line citations and verifiable errors rather than vague preferences.',
      'Consistent calibration against edge-case rubrics unlocks senior audit and higher-rate queues.',
    ],
  };
}

export function resolveCompanyKitProfile(
  payload: CareerPrepPayload
): CompanyKitProfile {
  const bundleId: RoleBundleId = payload.roleBundleId || 'rlhf';
  const bundle = getRoleBundleById(bundleId);

  const companyName =
    payload.jobMeta?.company ||
    payload.resume?.targetCompany ||
    payload.sourceLabel.split('·')[0].trim() ||
    'Verified AI Employer';

  const companyLower = companyName.toLowerCase();
  const matchedSeed =
    VERIFIED_COMPANY_DIRECTORY[companyLower] ||
    Object.entries(VERIFIED_COMPANY_DIRECTORY).find(([key]) =>
      companyLower.includes(key)
    )?.[1];

  const roleTitle =
    payload.jobMeta?.title || payload.resume?.targetTitle || bundle.title;
  const domain =
    payload.companyDomain ||
    matchedSeed?.domain ||
    resolveBrandDomain(companyName);
  const payBand =
    payload.jobMeta?.payRange || payload.payBand || bundle.payBand;
  const location = payload.jobMeta?.location || bundle.timezoneSummary;
  const contractType = payload.jobMeta?.type || bundle.contractFormat;
  const rawApplyUrl =
    payload.jobMeta?.applyUrl ||
    payload.applyUrl ||
    matchedSeed?.defaultApplyUrl ||
    bundle.employerLinks[0].applyUrl;

  return {
    company: companyName,
    domain,
    roleTitle,
    payBand,
    location,
    contractType,
    applyUrl: resolveApplyUrl(companyName, rawApplyUrl),
    companyBackground:
      matchedSeed?.companyBackground ||
      `${companyName} hires distributed remote specialists across global timezones with upfront USD compensation and direct ATS application links.`,
    whatTheyBuild:
      matchedSeed?.whatTheyBuild ||
      payload.jobMeta?.summary ||
      bundle.overviewSummary,
    screeningFormat:
      matchedSeed?.screeningFormat ||
      `${contractType} · Async portfolio & structured role evaluation rubric`,
    rubricExpectations:
      matchedSeed?.rubricExpectations ||
      (payload.jobMeta?.requirements.length
        ? payload.jobMeta.requirements
        : bundle.requirements),
    video: selectVideoForProfile(bundleId, companyLower, payload.customVideoUrl),
  };
}
