import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { prompt, team, style } = await request.json()

    if (!prompt || !team) {
      return NextResponse.json(
        { error: 'Prompt and team are required' },
        { status: 400 }
      )
    }

    // Create a detailed prompt for flag generation
    const teamColor = team === 'red' ? 'red and white' : 'blue and white'
    const styleDescriptor = getStyleDescriptor(style)
    
    const enhancedPrompt = `A ${styleDescriptor} flag design with ${teamColor} colors. ${prompt}. The flag should be suitable for a capture the flag video game, with bold geometric patterns, symbols, or emblems. High contrast, clean design, no text or letters, game-ready flag texture.`

    console.log('Generating flag with prompt:', enhancedPrompt)

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid",
    })

    const imageUrl = response.data?.[0]?.url

    if (!imageUrl) {
      throw new Error('No image generated')
    }

    // TODO: Upload to permanent storage (IPFS, AWS S3, etc.)
    // For now, we'll return the OpenAI URL (expires after 1 hour)

    return NextResponse.json({
      imageUrl,
      prompt: enhancedPrompt,
      team,
      style,
      generatedAt: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Error generating flag:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      { error: `Failed to generate flag: ${errorMessage}` },
      { status: 500 }
    )
  }
}

function getStyleDescriptor(style: string): string {
  switch (style) {
    case 'realistic':
      return 'realistic military-style'
    case 'cartoon':
      return 'cartoon-style colorful'
    case 'pixel':
      return 'pixel art retro gaming'
    case 'abstract':
      return 'abstract geometric modern'
    default:
      return 'modern gaming'
  }
}

// Optional: GET method to check if the API is working
export async function GET() {
  return NextResponse.json({
    message: 'Flag generation API is working',
    timestamp: new Date().toISOString(),
  })
} 