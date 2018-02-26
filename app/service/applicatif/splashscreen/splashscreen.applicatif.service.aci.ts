import { Message } from "app/donnee/splashScreen/message";

export abstract class SplashscreenApplicatifServiceACI {
    public abstract sendMessage(data: Message);
}