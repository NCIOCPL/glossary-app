Feature: Audio Pronunciation Player on Term Page

    As a user, I want to hear how a term is pronounced, so that I may be able to pronounce it correctly when talking with others

    Scenario: Negative : No pronunciation to play on a term page
        Given the user is viewing the definition with the pretty url "hpv"
        Then there is no audio player or icon

    Scenario: Able to play the pronunciation on a term page
        Given the user is viewing the definition with the pretty url "metastatic"
        And there is an audio player with the url "https://nci-media-dev.cancer.gov/pdq/media/audio/704104.mp3" before the phonetic spelling
        When the user clicks the audio speaker icon
        Then the pronunciation for metastatic should play
        And a pause button appears in place of the speaker icon
        When user clicks pause
        Then the audio track pauses and the play icon appears
        When user clicks play icon
        Then audio plays from where it was paused and the pause icon appears
        And when audio has finished playing, the button returns to the audio speaker icon