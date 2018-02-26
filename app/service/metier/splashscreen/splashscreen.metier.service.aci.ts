import { Message } from "app/donnee/splashScreen/message";

export abstract class SplashscreenMetierServiceACI {
    public abstract sendMessage(data: Message);
}