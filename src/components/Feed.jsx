import AnimatedContent from './Animations/AnimatedContent'

function Feed() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pavlova-50 via-pavlova-100 to-pavlova-200 flex items-center justify-center">
      <AnimatedContent
        distance={150}
        direction="vertical"
        duration={1.2}
        ease="bounce.out"
        initialOpacity={0.2}
        scale={0.9}
        delay={0.3}
      >
        <h1 className="text-2xl font-bold text-pavlova-800">Feed (En desarrollo)</h1>
      </AnimatedContent>
    </div>
  )
}

export default Feed