using MindVault.Extensions.Application;
using MindVault.Infrastructure;
using MindVault.Web;

var builder = WebApplication.CreateBuilder(args);

builder.AddServices();
builder.AddInfrastructure();
builder.AddApplicationServices();

var frontendUrl = builder.Configuration["FrontendUrl"] ?? throw new NullReferenceException("FrontendUrl is not configured");
builder.Services.AddCors(x =>
{
    x.AddPolicy(frontendUrl, builder => builder
        .WithOrigins(frontendUrl)
        .AllowAnyMethod()
        .AllowAnyHeader());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors(frontendUrl);
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
