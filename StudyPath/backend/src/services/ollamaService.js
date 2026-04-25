import { env } from '../config/env.js'

const RECOMMENDED_LOW_MEMORY_MODEL = 'qwen2.5:0.5b'

async function chatWithOllama(messages, options = {}) {
  let response
  try {
    response = await fetch(`${env.ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: env.ollamaModel,
        messages,
        stream: false,
        options: {
          num_ctx: env.ollamaNumCtx,
          ...options,
        },
      }),
    })
  } catch {
    const err = new Error(
      `Impossible de joindre Ollama sur ${env.ollamaUrl}. Verifie que le serveur Ollama tourne, puis reessaie.`,
    )
    err.status = 503
    throw err
  }

  if (!response.ok) {
    const text = await response.text()
    if (response.status === 404 && /model\s+".+?"\s+not found/i.test(text)) {
      const err = new Error(
        `Le modele Ollama "${env.ollamaModel}" est introuvable. Lance \`ollama pull ${env.ollamaModel}\` ou change \`OLLAMA_MODEL\` dans \`backend/.env\` vers un modele deja installe.`,
      )
      err.status = 503
      throw err
    }

    if (
      response.status === 500 &&
      /requires more system memory .* than is available/i.test(text)
    ) {
      const err = new Error(
        `Le modele Ollama "${env.ollamaModel}" demande plus de RAM que disponible. Utilise un modele plus leger comme \`${RECOMMENDED_LOW_MEMORY_MODEL}\`, reduis le contexte avec \`OLLAMA_NUM_CTX=2048\`, puis mets ces valeurs dans \`backend/.env\` et lance \`ollama pull ${RECOMMENDED_LOW_MEMORY_MODEL}\`.`,
      )
      err.status = 503
      throw err
    }

    const err = new Error(`Ollama error: ${response.status} ${text}`)
    err.status = response.status
    throw err
  }

  const data = await response.json()
  return data.message?.content || ''
}

export async function analyzeCvText(cvText) {
  return chatWithOllama([
    {
      role: 'system',
      content: `Tu es un expert du recrutement, de l'analyse de CV et de l'orientation de carrière.
Réponds uniquement en français.

Ta mission: produire UNE analyse unique, honnête, concrète, structurée et actionnable du CV.
Ne sépare pas la réponse en deux blocs du type "analyse" puis "suggestions". Fais un seul diagnostic complet.
Ne parle presque jamais du design visuel du CV. Analyse surtout le contenu, le positionnement, la crédibilité, la clarté et la valeur marché.

Le ton attendu:
- honnête mais utile
- direct
- précis
- orienté recrutement réel
- pas de phrases vagues

Tu dois suivre cette structure exacte, avec des titres clairs et des emojis de section:

1. "1. Analyse globale (honnete)"
   - résume le niveau global du CV
   - dis clairement ce qui est bon
   - dis clairement ce qui pose problème
   - termine par un mini résumé "En résumé"

2. "2. Les points a ameliorer (priorite haute)"
   - liste 3 à 6 problèmes prioritaires
   - pour chaque point:
     - un titre court
     - pourquoi c'est un problème en recrutement
     - une solution concrète
     - si utile, un exemple de reformulation

3. "3. Ce qu'il faut ajouter absolument"
   - projets
   - preuves concrètes
   - GitHub / portfolio / certifications / résultats chiffrés
   - seulement si pertinent selon le CV

4. "4. Recommandations personnalisees"
   - certifications pertinentes pour ce profil
   - langages / outils à apprendre
   - compétences techniques et soft skills à développer
   - recommandations adaptées au domaine réel du candidat
   - évite les recommandations génériques ou à la mode si elles ne sont pas utiles

5. "5. Positionnement et orientation carriere"
   - dis quel positionnement semble le plus crédible actuellement
   - junior / confirmé / spécialisation possible
   - propose des pistes réalistes
   - explique comment se différencier sur le marché

6. "6. Plan d'amelioration concret (3 mois)"
   - Mois 1
   - Mois 2
   - Mois 3
   - actions simples, claires et réalistes

7. "Conclusion"
   - conclusion courte et forte
   - dis clairement le principal frein actuel
   - dis clairement le principal levier d'amélioration

Règles importantes:
- donne des critiques réelles, pas un compliment artificiel
- si le CV est trop généraliste, dis-le
- si les compétences sont trop dispersées, dis-le
- si les expériences manquent d'impact, dis-le
- si le positionnement est flou, dis-le
- si des mots-clés ATS importants manquent, dis lesquels
- si certaines technos semblent superficielles, dis-le avec tact mais clairement
- adapte les certifications et la trajectoire au contenu réel du CV
- pas de tableau
- pas de JSON
- pas de markdown complexe
- utilise un format texte très lisible
- quand c'est possible, donne des exemples de reformulation ou d'amélioration`
    },
    { role: 'user', content: cvText }
  ], { temperature: 0.3 })
}

export async function suggestCvImprovements(cvText) {
  return chatWithOllama([
    {
      role: 'system',
      content: 'You are a career coach. Based on the CV, reply in French with concrete next steps: certifications, projects, portfolio ideas, interview prep, networking actions, and a 30/60/90 day plan.'
    },
    { role: 'user', content: cvText }
  ], { temperature: 0.5 })
}

export async function careerChat({ message, cvText = '', analysisText = '', history = [] }) {
  const normalizedHistory = Array.isArray(history)
    ? history.filter((item) => item && item.role && item.content).slice(-10)
    : []

  return chatWithOllama([
    {
      role: 'system',
      content: `Tu es un AI career coach tres utile, tres concis et tres precis.
Reponds uniquement en francais.

Comportement obligatoire:
- reponds directement a la question exacte de l'utilisateur
- fais des reponses courtes par defaut
- evite les longs paragraphes
- n'ajoute pas de conseils hors sujet
- utilise le CV et l'analyse du CV comme contexte principal
- si la question demande un choix, donne une reponse claire et tranchee
- si la question demande des idees, donne 3 a 5 idees maximum
- si la question demande une correction ou une recommandation, donne la meilleure reponse d'abord

Style de reponse:
- bref
- concret
- actionnable
- personnalise selon le CV et l'analyse
- pas de blabla

Regles:
- ne repete pas tout le CV
- ne re-ecris pas une analyse complete si ce n'est pas demande
- si l'information manque dans le CV, dis-le en une phrase courte
- quand c'est utile, commence par une phrase de reponse directe, puis 2 a 4 points maximum
- privilegie la pertinence a la quantite`
    },
    ...(cvText ? [{ role: 'system', content: `CV context:\n${cvText}` }] : []),
    ...(analysisText ? [{ role: 'system', content: `CV analysis context:\n${analysisText}` }] : []),
    ...normalizedHistory,
    { role: 'user', content: message }
  ], { temperature: 0.35 })
}
