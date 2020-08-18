class UpdateSubject{
    observers = [];
  
    attach = observer => this.observers.push(observer);
  
    detach = observerToRemove => this.observers = this.observers.filter(observer => observerToRemove !== observer);
  
    update = value => this.notify(value);
  
    notify = value => this.observers.forEach(observer => observer(value));
}
  
  export const updateSubject = new UpdateSubject();
  