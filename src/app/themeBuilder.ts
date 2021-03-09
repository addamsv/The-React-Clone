import MainController from '../controllers/controller';

class ThemeBuilder {
  private mainController: MainController;

  public start() {
    this.mainController = new MainController();
  }
}

export default ThemeBuilder;
